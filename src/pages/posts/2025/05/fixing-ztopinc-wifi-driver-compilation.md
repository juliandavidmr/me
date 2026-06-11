---
title: "Fixing ZTopInc WiFi Driver Compilation on Ubuntu 24.04 LTS"
description: "UPDATE 2026: Fix for new linux kernel versions (6.17+) in this branch: https://codeberg.org/anlijudavid/driver_wifi_ztopinc/src/branch/linux-kernel-6-17 __________________________________________ If you're struggling to get your ZTopInc 802"
pubDate: "2025-05-26T10:47:00.010-05:00"
updatedDate: "2026-03-25T13:41:56.382-05:00"
author: "Julian David"
tags: []
originalUrl: "https://www.iamjuliand.com/2025/05/fixing-ztopinc-wifi-driver-compilation.html"
bloggerId: "3484353906199187037"
commentsCount: 3
images: []
---
<p style="text-align: left;"><b><span style="color: #38761d;">UPDATE 2026: Fix for new linux kernel versions (6.17+) in this branch: <a href="https://codeberg.org/anlijudavid/driver_wifi_ztopinc/src/branch/linux-kernel-6-17">https://codeberg.org/anlijudavid/driver_wifi_ztopinc/src/branch/linux-kernel-6-17</a>&nbsp;</span></b></p><p style="text-align: left;"><b>__________________________________________&nbsp;</b></p><p style="text-align: left;"><b>If you're struggling to get your ZTopInc 802.11n NIC (USB ID: <code>350b:9101</code>) working on Ubuntu 24.04, you're not alone. The driver available in most repositories fails to compile on modern Linux kernels due to outdated code that hasn't been updated for recent kernel changes.</b></p>
<h2 id="the-problem">The Problem</h2>
<p>When trying to compile the ZTopInc Wi-Fi driver on Ubuntu 24.04 with kernel 6.11, you'll encounter these compilation errors:</p>
<pre><code class="lang-bash">/src/<span class="hljs-built_in">os</span>/linux/hif/usb.c:<span class="hljs-number">1114</span>:<span class="hljs-number">2</span>: <span class="hljs-built_in">error</span>: invalid preprocessing directive #<span class="hljs-keyword">elseif</span>; did you mean #<span class="hljs-keyword">else</span>?
/src/<span class="hljs-built_in">os</span>/linux/hif/usb.c:<span class="hljs-number">1115</span>:<span class="hljs-number">6</span>: <span class="hljs-built_in">error</span>: <span class="hljs-string">'struct usb_driver'</span> has no member named <span class="hljs-string">'drvwrap'</span>
</code></pre>
<p>The driver was written for much older kernel versions and uses deprecated structures and incorrect preprocessor syntax.</p>
<h2 id="the-root-cause">The Root Cause</h2>
<p>Two main issues prevent compilation:</p>
<ol>
<li><b>Invalid preprocessor directive</b>: The code uses <code>#elseif</code> instead of the correct <code>#elif</code></li>
<li><b>Obsolete kernel structure</b>: The <code>drvwrap.driver.shutdown</code> field no longer exists in modern kernel versions</li>
</ol>
<p>The problematic code looked like this:</p>
<pre><code class="lang-c">#elseif (LINUX_VERSION_CODE &gt;= KERNEL_VERSION(<span class="hljs-number">2</span>, <span class="hljs-number">6</span>, <span class="hljs-number">19</span>)) &amp;&amp; (LINUX_VERSION_CODE &lt; KERNEL_VERSION(<span class="hljs-number">6</span>, <span class="hljs-number">8</span>, <span class="hljs-number">0</span>))
    .drvwrap.driver.shutdown = zt_usb_shutdown,
</code></pre>
<h2 id="the-solution">The Solution</h2>
<p>The fix is straightforward but essential for modern kernel compatibility:</p>
<pre><code class="lang-c"><span class="hljs-selector-id">#elif</span> (LINUX_VERSION_CODE &gt;= KERNEL_VERSION(<span class="hljs-number">2</span>, <span class="hljs-number">6</span>, <span class="hljs-number">19</span>))
    <span class="hljs-selector-class">.shutdown</span> = zt_usb_shutdown,
</code></pre>
<h2 id="getting-the-fixed-driver">Getting the Fixed Driver</h2>
<p>I've created a pull request with the fix to the original repository, and also maintain a fork with the working code:</p>
<ul>
<li><b>Original repository</b>: <a href="https://codeberg.org/sallecta/driver_wifi_ztopinc">driver_wifi_ztopinc</a></li>
<li><b>Pull request with fix</b>: <a href="https://codeberg.org/sallecta/driver_wifi_ztopinc/pulls/2">PR #2</a></li>
<li><b>Working fork</b>: <a href="https://codeberg.org/anlijudavid/driver_wifi_ztopinc">anlijudavid/driver_wifi_ztopinc</a></li>
</ul>
<h2 id="installation">Installation</h2>
<p>To use the fixed driver on Ubuntu 24.04:</p>
<pre><code class="lang-bash"><span class="hljs-comment"># Clone the working fork</span></code></pre><pre><code class="lang-bash"><blockquote>git <span class="hljs-keyword">clone</span> <span class="hljs-title">https</span>://codeberg.org/anlijudavid/driver_wifi_ztopinc.git
cd driver_wifi_ztopinc/src&nbsp;</blockquote></code></pre><pre><br /></pre><pre># Compile</pre><pre><code class="lang-bash"><blockquote>make&nbsp;</blockquote></code></pre><pre><code class="lang-bash">&nbsp;</code></pre><pre><code class="lang-bash">&nbsp;<span class="hljs-comment"># Install</span>
<pre class="code-block" style="--fonts-regular: -apple-system, &quot;Segoe UI&quot;, system-ui, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Noto Color Emoji&quot;, &quot;Twemoji Mozilla&quot;; background-color: #ececee; border-color: currentcolor; border-radius: 4px; border-style: solid; border-width: 0px; box-sizing: border-box; caret-color: rgb(24, 24, 27); color: #18181b; font-family: ui-monospace, SFMono-Regular, &quot;SF Mono&quot;, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Noto Color Emoji&quot;, &quot;Twemoji Mozilla&quot;; font-size: 13.6px; line-height: 1.45; margin-bottom: 16px; margin-top: 0px; overflow-wrap: normal; overflow: auto; padding: 16px; position: relative; scrollbar-color: initial; scrollbar-width: initial;"><code class="chroma language-text display" style="--fonts-regular: -apple-system, &quot;Segoe UI&quot;, system-ui, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Noto Color Emoji&quot;, &quot;Twemoji Mozilla&quot;; background: 0% 0% repeat; border-radius: 4px; border: 0px; box-sizing: border-box; display: inline; font-family: ui-monospace, SFMono-Regular, &quot;SF Mono&quot;, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Noto Color Emoji&quot;, &quot;Twemoji Mozilla&quot;; line-height: inherit; margin: 0px; overflow-wrap: normal; padding: 0px; scrollbar-color: initial; scrollbar-width: initial; text-wrap-mode: wrap; word-break: break-all;">sudo insmod ./zt9101_ztopmac_usb.ko cfg=./wifi.cfg</code></pre></code></pre>
<h2 id="verified-working-environment">Verified Working Environment</h2>
<p>This fix has been tested and confirmed working on:</p>
<ul>
<li><b>OS</b>: Ubuntu 24.04 LTS</li>
<li><b>Kernel</b>: 6.11.0-26-generic</li>
<li><b>Device</b>: ZTopInc 802.11n NIC (idVendor=350b, idProduct=9101)</li>
<li><b>Compiler</b>: gcc-13</li>
</ul>
<h2 id="why-this-matters">Why This Matters</h2>
<p>These kinds of compatibility issues are common with older drivers as the Linux kernel evolves. Small syntax errors and deprecated structures can completely break compilation, leaving users unable to use their hardware on modern systems.</p>
<p>By maintaining updated forks and contributing fixes back to original repositories, we can keep older hardware working with current Linux distributions.</p>
<p>If you have this WiFi adapter and have been struggling to get it working on recent Ubuntu versions, give the fixed driver a try!</p>
<h2 id="second-heading">The end ...</h2>

