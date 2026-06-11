---
title: 'Fixing ZTopInc WiFi Driver Compilation on Ubuntu 24.04 LTS'
description: "UPDATE 2026: Fix for new linux kernel versions (6.17+) in this branch: https://codeberg.org/anlijudavid/driver_wifi_ztopinc/src/branch/linux-kernel-6-17 __________________________________________ If you're struggling to get your ZTopInc 802"
pubDate: '2025-05-26T10:47:00.010-05:00'
updatedDate: '2026-03-25T13:41:56.382-05:00'
author: 'Julian David'
tags: []
originalUrl: 'https://www.iamjuliand.com/2025/05/fixing-ztopinc-wifi-driver-compilation.html'
bloggerId: '3484353906199187037'
commentsCount: 3
images: []
---

**UPDATE 2026: Fix for new Linux kernel versions (6.17+) in this branch: [linux-kernel-6-17](https://codeberg.org/anlijudavid/driver_wifi_ztopinc/src/branch/linux-kernel-6-17)**

---

**If you're struggling to get your ZTopInc 802.11n NIC (USB ID: `350b:9101`) working on Ubuntu 24.04, you're not alone. The driver available in most repositories fails to compile on modern Linux kernels due to outdated code that hasn't been updated for recent kernel changes.**

## The Problem

When trying to compile the ZTopInc Wi-Fi driver on Ubuntu 24.04 with kernel 6.11, you'll encounter these compilation errors:

```text
/src/os/linux/hif/usb.c:1114:2: error: invalid preprocessing directive #elseif; did you mean #else?
/src/os/linux/hif/usb.c:1115:6: error: 'struct usb_driver' has no member named 'drvwrap'
```

The driver was written for much older kernel versions and uses deprecated structures and incorrect preprocessor syntax.

## The Root Cause

Two main issues prevent compilation:

1. **Invalid preprocessor directive**: The code uses `#elseif` instead of the correct `#elif`
2. **Obsolete kernel structure**: The `drvwrap.driver.shutdown` field no longer exists in modern kernel versions

The problematic code looked like this:

```c
#elseif (LINUX_VERSION_CODE >= KERNEL_VERSION(2, 6, 19)) && (LINUX_VERSION_CODE < KERNEL_VERSION(6, 8, 0))
    .drvwrap.driver.shutdown = zt_usb_shutdown,
```

## The Solution

The fix is straightforward but essential for modern kernel compatibility:

```c
#elif (LINUX_VERSION_CODE >= KERNEL_VERSION(2, 6, 19))
    .shutdown = zt_usb_shutdown,
```

## Getting the Fixed Driver

I've created a pull request with the fix to the original repository, and also maintain a fork with the working code:

- **Original repository**: [driver_wifi_ztopinc](https://codeberg.org/sallecta/driver_wifi_ztopinc)
- **Pull request with fix**: [PR #2](https://codeberg.org/sallecta/driver_wifi_ztopinc/pulls/2)
- **Working fork**: [anlijudavid/driver_wifi_ztopinc](https://codeberg.org/anlijudavid/driver_wifi_ztopinc)

## Installation

To use the fixed driver on Ubuntu 24.04:

```bash
# Clone the working fork
git clone https://codeberg.org/anlijudavid/driver_wifi_ztopinc.git
cd driver_wifi_ztopinc/src

# Compile
make

# Install
sudo insmod ./zt9101_ztopmac_usb.ko cfg=./wifi.cfg
```

## Verified Working Environment

This fix has been tested and confirmed working on:

- **OS**: Ubuntu 24.04 LTS
- **Kernel**: 6.11.0-26-generic
- **Device**: ZTopInc 802.11n NIC (idVendor=350b, idProduct=9101)
- **Compiler**: gcc-13

## Why This Matters

These kinds of compatibility issues are common with older drivers as the Linux kernel evolves. Small syntax errors and deprecated structures can completely break compilation, leaving users unable to use their hardware on modern systems.

By maintaining updated forks and contributing fixes back to original repositories, we can keep older hardware working with current Linux distributions.

If you have this WiFi adapter and have been struggling to get it working on recent Ubuntu versions, give the fixed driver a try!

## The end ...
