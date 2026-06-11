---
title: "Amplitude Experiment + React"
description: "In this post, you'll learn: Use amplitude experiments with React. Create AB tests on any react component. Requirements Access to Amplitude Experiments A React project. But... What is Amplitude Experiments ? Amplitude Experiment embeds analy"
pubDate: "2022-01-14T14:50:00.017-05:00"
updatedDate: "2023-08-09T15:33:10.255-05:00"
author: "Julian David"
tags: ["abtest","english","react","typescript"]
originalUrl: "https://www.iamjuliand.com/2022/01/amplitude-experiment-react.html"
bloggerId: "5109027009320469839"
commentsCount: 0
images: ["/assets/blog/2022/01/amplitude-experiment-react/01.png"]
imgSrc: "/assets/blog/2022/01/amplitude-experiment-react/01.png"
imgAlt: "Amplitude Experiment + React"
---
<h3 style="text-align: left;"><div class="separator" style="clear: both; text-align: center;"><a href="/assets/blog/2022/01/amplitude-experiment-react/01.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="472" data-original-width="800" height="236" src="/assets/blog/2022/01/amplitude-experiment-react/01.png" width="400" /></a></div></h3><h3 style="text-align: left;"><b>In this post, you'll learn:</b></h3>
<div>
  <p style="text-align: left;"></p>
  <ul style="text-align: left;">
    <li>Use amplitude experiments with React.</li>
  </ul>
  <ul style="text-align: left;">
    <li>Create AB tests on any react component.</li>
  </ul>
  <p></p>
  <h3 style="text-align: left;"><b>Requirements</b></h3>
</div>
<div>
  <ul style="text-align: left;">
    <li>
      Access to
      <a href="https://experiment.amplitude.com/" target="_blank">Amplitude Experiments</a>
    </li>
    <li>A React project.</li>
  </ul>
  <h3 style="text-align: left;">
    But... What is
    <a href="https://experiment.amplitude.com/">Amplitude Experiments</a>?
  </h3>
</div>
<p style="text-align: left;">
  Amplitude Experiment embeds analytics and customer behavior into A/B testing
  and rollout workflows, so teams learn faster and adapt experiences for key
  segments.
</p>
<span><a name='more'></a></span>
<h3 style="text-align: left;">Implement Experiment in React</h3>
<div style="text-align: left;"><b>1. Install dependencies:</b></div>
<blockquote style="border: medium; margin: 0px 0px 0px 40px; padding: 0px; text-align: left;"></blockquote>
<span style="font-family: &quot;Source Code Pro&quot;;"></span>
<blockquote></blockquote>
<span style="font-family: Source Code Pro; font-size: x-small;">npm i @amplitude/experiment-js-client amplitude-js<br /></span>
<div style="text-align: left;">
  <span style="font-family: Source Code Pro; font-size: x-small;"># Yarn yarn add @amplitude/experiment-js-client amplitude-js</span>
</div>
<br />
<b>2. Create React Context and Provider</b><br /><a href="https://dev.to/dashboard#21-define-context-provider"></a><b><br /></b>
<div>
  <b>2.1. Define context provider</b><br />
  <p style="text-align: left;">
    We need a context provider to globalize all functions and objects needed for
    experiments.
  </p>
  <script src="https://gist.github.com/juliandavidmr/77839a29c85574d2f4b112161ee5c292.js"></script>
  <p style="text-align: left;"><b>2.2. Define provider</b></p>
  <p style="text-align: left;">
    This provider wrap common functions to isolate direct amplitude functions
    one level top.
  </p>
  <script src="https://gist.github.com/juliandavidmr/f0c31ad056fe01c9522f9701272ce03a.js"></script>
  <p style="text-align: left;"><b>2.3. Define layout component</b></p>
  The layout component will initialize the amplitude provider for ease use in
  other components, so in each component you don't need to pass all required
  properties.
  <script src="https://gist.github.com/juliandavidmr/233b6941ad03b5e094706e79d354c4f1.js"></script>
  <p style="text-align: left;">
    <b>2.4. Using context provider data from a hook</b>
  </p>
  The useExperiment hook return all context value.
  <script src="https://gist.github.com/juliandavidmr/c8f537b6083577a262609894d0712fbf.js"></script>
</div>
<h3 style="text-align: left;">Final implementation</h3>
<p style="text-align: left;">
  Initialize the client in your application startup. You will need the API Key
  for your deployment. You can find the API Key in the Deployments section of
  your Experiment instance. To learn more about how to setup your Project and
  deployments, please refer to
  <a href="https://developers.experiment.amplitude.com/docs/deployments">Deployments</a>.
</p>
<script src="https://gist.github.com/juliandavidmr/55fc7eed6107f06a0e12b683aeffefb2.js"></script>
<p style="text-align: left;"><br /></p>
<h3 style="text-align: left;"><b>Helpful guides</b></h3>
<p style="text-align: left;"></p>
<ul style="text-align: left;">
  <li>
    <a href="https://help.amplitude.com/hc/en-us/articles/360061687611-Roll-out-your-experiment" target="_blank">Roll out your experiment</a>.
  </li>
  <li>
    <a href="https://developers.experiment.amplitude.com/docs/javascript-client-sdk">Using Experiment JavaScript Client SDK</a>.
  </li>
  <li>
    <a href="https://github.com/amplitude/experiment-js-client/tree/main/packages/browser-demo/">Official GitHub demo</a>.
  </li>
  <li>
    <a href="https://amplitude.com/amplitude-experiment">https://amplitude.com/amplitude-experiment</a>&nbsp;
  </li>
</ul>
<p></p>
<span><!--more--></span>
<div style="text-align: center;">
  <i><span style="font-family: Hachi Maru Pop; font-size: xx-small;">Did you like this post? Leave a comment :)</span></i>
</div>

