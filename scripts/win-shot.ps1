param(
  [string]$Out = "",
  [switch]$Front,
  [switch]$Park,
  [switch]$Speaker,
  [string]$Keys = "",
  [int]$Key = 0,
  [switch]$GetForeground,
  [long]$RestoreForeground = 0,
  [string]$TitleLike = "*GitHub Enterprise*",
  [string]$TitleNotLike = "Speaker*"
)
# Captures a real Microsoft Edge window on this desktop (any monitor) to a PNG, optionally bringing it to the
# front first, and can press one real key through the system input queue so the browser sees a genuine user
# gesture. Used by scripts/deck-live-edge.mjs so the screenshots show the physical screen, not a headless render.
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices; using System.Collections.Generic; using System.Text;
public class WinShot {
  public delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool attach);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L; public int T; public int R; public int B; }
  public static List<IntPtr> Handles = new List<IntPtr>();
  public static List<string> Titles = new List<string>();
  public static void Collect() {
    Handles.Clear(); Titles.Clear();
    EnumWindows(delegate(IntPtr h, IntPtr l) {
      if (!IsWindowVisible(h)) return true;
      StringBuilder sb = new StringBuilder(512); GetWindowText(h, sb, 512);
      if (sb.Length > 0) { Handles.Add(h); Titles.Add(sb.ToString()); }
      return true;
    }, IntPtr.Zero);
  }
}
"@
# Without this, on a scaled display (125%, 150%...) window rects come back in virtual pixels while
# CopyFromScreen copies physical pixels, and every capture is cropped at the right and bottom.
[void][WinShot]::SetProcessDPIAware()

function Bring-Front([IntPtr]$h) {
  if ([WinShot]::IsIconic($h)) { [void][WinShot]::ShowWindow($h, 9) }
  if ([WinShot]::GetForegroundWindow() -eq $h) { return }
  # 1. attach to the thread that owns the foreground window; that lets this process hand the foreground over
  #    without sending any key, so the browser's keyboard focus stays on the page
  $fg = [WinShot]::GetForegroundWindow()
  $fgPid = [uint32]0
  $fgThread = [WinShot]::GetWindowThreadProcessId($fg, [ref]$fgPid)
  $me = [WinShot]::GetCurrentThreadId()
  [void][WinShot]::AttachThreadInput($me, $fgThread, $true)
  [void][WinShot]::SetForegroundWindow($h); [void][WinShot]::BringWindowToTop($h)
  [void][WinShot]::AttachThreadInput($me, $fgThread, $false)
  Start-Sleep -Milliseconds 300
  if ([WinShot]::GetForegroundWindow() -eq $h) { return }
  # 2. fallback: an Alt tap also unlocks SetForegroundWindow (it may move Edge's keyboard focus to its toolbar)
  [WinShot]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero); [WinShot]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
  [void][WinShot]::SetForegroundWindow($h)
  Start-Sleep -Milliseconds 300
}

if ($GetForeground) { Write-Output ([long][WinShot]::GetForegroundWindow()); exit 0 }
if ($RestoreForeground -ne 0) { Bring-Front ([IntPtr]$RestoreForeground); exit 0 }

if ($Speaker) { $TitleLike = "Speaker*"; $TitleNotLike = "" }
# find the Edge top-level window by title (every Edge window belongs to one browser process, so the
# process's MainWindowHandle is not enough once the speaker pop-up is open)
$h = [IntPtr]::Zero; $title = ""
[WinShot]::Collect()
for ($i = 0; $i -lt [WinShot]::Titles.Count; $i++) {
  $t = [WinShot]::Titles[$i]
  if (($t -like $TitleLike) -and ($TitleNotLike -eq "" -or $t -notlike $TitleNotLike)) {
    $wpid = [uint32]0; [void][WinShot]::GetWindowThreadProcessId([WinShot]::Handles[$i], [ref]$wpid)
    $proc = Get-Process -Id $wpid -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq 'msedge') { $h = [WinShot]::Handles[$i]; $title = $t; break }
  }
}
if ($h -eq [IntPtr]::Zero) { Write-Error "no Edge window matching '$TitleLike' (not '$TitleNotLike')"; exit 1 }
if ($Front) { Bring-Front $h; Start-Sleep -Milliseconds 200 }
if ($Park) {
  # park the real mouse pointer at the right edge of the primary screen so no hover state leaks into a capture
  $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  [void][WinShot]::SetCursorPos($b.Right - 2, [int]($b.Height / 2))
}
if ($Key -ne 0) {
  # a real key press through the system input queue: the user gesture a browser needs before it goes fullscreen
  [WinShot]::keybd_event([byte]$Key, 0, 0, [UIntPtr]::Zero); [WinShot]::keybd_event([byte]$Key, 0, 2, [UIntPtr]::Zero)
  Start-Sleep -Milliseconds 400
}
if ($Keys -ne "") {
  # several real key presses in one process (each process start compiles the helper class)
  foreach ($k in $Keys.Split(",")) { $vk = [byte][int]$k; [WinShot]::keybd_event($vk, 0, 0, [UIntPtr]::Zero); [WinShot]::keybd_event($vk, 0, 2, [UIntPtr]::Zero); Start-Sleep -Milliseconds 250 }
  Start-Sleep -Milliseconds 400
}
$r = New-Object WinShot+RECT
[void][WinShot]::GetWindowRect($h, [ref]$r)
$w = $r.R - $r.L; $hh = $r.B - $r.T
if ($Out -ne "") {
  $bmp = New-Object System.Drawing.Bitmap $w, $hh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CopyFromScreen($r.L, $r.T, 0, 0, (New-Object System.Drawing.Size $w, $hh))
  $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
$fg = [WinShot]::GetForegroundWindow()
$screens = ([System.Windows.Forms.Screen]::AllScreens | ForEach-Object { "$($_.Bounds.Width)x$($_.Bounds.Height)@$($_.Bounds.X),$($_.Bounds.Y)" + $(if ($_.Primary) { "*" } else { "" }) }) -join " "
Write-Output ("window=" + $r.L + "," + $r.T + " " + $w + "x" + $hh + " foreground=" + $(if ($fg -eq $h) { "yes" } else { "no" }) + " title=" + $title + " screens=" + $screens)
