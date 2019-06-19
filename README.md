# GifIt

A JavaScript clone of the popular [**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif).

## Contents

- [**Objective**](#objective)
- [**Installation**](#installation)
- [**Tech Stack**](#tech-stack)
- [**Features**](#features)
  - [**Screen Recorder**](#screen-recorder)
  - [**Webcam Recorder**](#webcam-recorder)
  - [**Board Recorder**](#board-recorder)
  - [**GIF Encoding**](#gif-encoding)
  - [**Editor**](#editor)
    - [**Selection**](#selection)
    - [**Playback**](#playback)
    - [**Duration**](#duration)
    - [**Title Frame**](#title-frame)
  - [**Icons**](#icons)

## Objective

[**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif) is a popular (7000⭐) _.NET_ application that allows users to record GIFs from their screen, webcam or sketchboard. It is written primarily in _C#_. **ScreenToGif** is an exceptional application and I highly recommend you go and download it. This project an attempt to clone the original using JavaScript for education purposes. If you want to make GIFs download [**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif).

## Installation

Currently this application is only available for **Windows**.

Download the latest release.

Please note this application is not intended for distrubution. As mentioned above, download [**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif).

## Tech Stack

Outline of the main dependencies used in the application.

|       Library       |    Version     |                         Description                         |
| :-----------------: | :------------: | :---------------------------------------------------------: |
|     `electron`      |     5.0.1      | A cross platform framework for building desktop application |
| `electron-webpack`  |     2.6.2      |             Compile Electron apps with webpack              |
| `electron-builder`  |    20.40.2     |      Package and build Electron apps for distribution       |
|       `react`       |     16.8.6     |       JavaScript library for building user interfaces       |
|     `react-dom`     |     16.8.6     |                React entry point to the DOM                 |
|     `react-rnd`     |     9.1.2      |        A resizable and draggable component for React        |
| `styled-components` |     4.2.0      |           Visual primitives for the component age           |
|   `gif-encoder-2`   |     1.0.0      |                  Create GIFs with Node.js                   |
|     `immutable`     |  4.0.0-rc.12   |    Immutable persistent data collections for JavaScript     |
|     `date-fns`      | 2.0.0-alpha.27 |                 Tool for manipulating dates                 |
|      `iohook`       |     0.4.6      |         Node.js native keyboard and mouse listener          |
|     `archiver`      |     3.0.0      |        A streaming interface for archive generation         |

## Features

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/startup.png" />
</p>

### Screen Recorder

Capture fullscreen, or selected portion, frame-by-frame at a user set frame rate. This is accomplished using **Electron's** `desktopCapturer` API with HTML video and canvas elements. The user can pause and resume recording. After the recorder is stopped a new project folder is created containing each frame saved as a PNG as well as other information relating to the project saved in a JSON file.

The screen recorder uses **Electron's** transparent `BrowserWindow` which allows the display of a small recorder user interface.

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/recorder-2.png" />
</p>

The `react-rnd` package provides a useful resizable/draggable component that can be used to select a portion of the screen. The dark tinted background is created with 4 separate `div` elements that resize along with the box.

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/recorder-1.png" />
</p>

When recording starts **Electron's** `Tray` API is used to add a red camera icon to the operating system tray in the lower right corner. Clicking this stops the recording. **Electron** also provides a `globalShortcut` API to set global shortcut keys. In this case, the `escape` key also stops recording.

### Webcam Recorder

Capture webcam output at a user set size, frame-by-frame at a user set frame rate. This works very similarly to the Screen Recorder except it uses a video input device, aka webcam, of the user's choosing. A notable feature is the ability to scale the size of the video with a HTML range input.

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/recorder-3.png" />
</p>

### Board Recorder

Capture canvas output as user draws onto white board. The board is an HTML canvas element. The key feature of the Board Recorder is that, by default, frames are only captured while the user is actually drawing. The end result is an animation that appears to draw itself.

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/recorder-4.png" />
</p>

### GIF Encoding

Combine all frames into a single GIF image. There a numerous options for this, including three seperate encoders. Options include setting frame delay, number of loops, quality and palette size. I forked an existing GIF encoding package and added the Octree algorithm as well as some speed optimizations to create [`gif-encoder-2`](https://github.com/benjaminadk/gif-encoder-2). This library is designed to be used in a Node environment.

As an alternative, [**FFmpeg**](https://ffmpeg.org/) can be used to encode the GIF. This is accomplished by using **Node's** `child_process` module. The user must download **FFmpeg** separately. **GitIt** will automatically look for the **FFmpeg** executable in the user's `PATH` environment variable, but the user can also enter this path manually in options.

| Encoder  | Speed | Filesize |                                                           GIF                                                           |
| :------: | :---: | :------: | :---------------------------------------------------------------------------------------------------------------------: |
| NeuQuant |  2nd  | largest  | ![kd-neu](https://raw.githubusercontent.com/benjaminadk/gif-encoder-2/master/examples/output/intermediate-neuquant.gif) |
|  Octree  |  3rd  |  middle  |  ![kd-oct](https://raw.githubusercontent.com/benjaminadk/gif-encoder-2/master/examples/output/intermediate-octree.gif)  |
|  FFmpeg  |  1st  | smallest |                    ![kd-ffmpeg](https://gifit-screenshots.s3-us-west-1.amazonaws.com/kd-ffmpeg.gif)                     |

### Editor

Offers a variety of features that can alter individual frames and manage the project as a whole.

<p align="center">
  <img src="https://gifit-screenshots.s3-us-west-1.amazonaws.com/editor-1.png" />
</p>

The top portion of the Editor is a menu with multiple tab categories. The main portion contains the current frame's image which can be scaled up and down. The bottom portion displays a row of thumbnails. Below the thumbnails is a small status bar that displays loading progress, messages and other controls. Various features require user input and these are displayed in a drawer which slides in and out from the right side of the screen.

#### Selection

While one full-size frame is displayed at a time, multiple frames can be selected using the standard `Control` and `Shift` key modifiers. Many editor features are applied to more than one frame at a time.

#### Playback

Frames can be played back at actual speed to give the user an idea of what the GIF output will look like.

#### Duration

Each frame has a duration property which is set as the frame is captured, based on the initial frame rate. The editor allows setting this property to any value, increasing/decreasing by a set value or scaling up/down by a set percentage.

#### Title Frame

Title frames can be inserted into the frame list at any point and consist of a solid background and text.

### Icons

I really liked the icon package that **ScreenToGif** used but I couldn't find anything remotely close to it for JavaScript. I ended up drawing them all by hand with [**Boxy SVG**](https://boxy-svg.com/) and creating a simple `Svg` component with **React** that accepts a `name` prop and returns the actual `svg` markup.
