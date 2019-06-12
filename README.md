# GifIt

A JavaScript clone of the popular [**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif)

## Contents

- [**Objective**](#objective)
- [**Tech Stack**](#tech-stack)
- [**Features**](#features)
  - [**Screen Recorder**](#screen-recorder)
  - [**Webcam Recorder**](#webcam-recorder)
  - [**Board Recorder**](#board-recorder)
  - [**GIF Encoding**](#gif-encoding)

## Objective

[**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif) is a popular (7000⭐) _.NET_ application that allows users to record GIFs from their screen, webcam or sketchboard. It is written primarily in _C#_. **ScreenToGif** is an exceptional application and I highly recommend you go and download it. This project an attempt to clone the original using JavaScript.

## Tech Stack

Outline of the main dependencies used in the application.

|       Library       |    Version     |                         Description                         |
| :-----------------: | :------------: | :---------------------------------------------------------: |
|     `electron`      |     5.0.1      | A cross platform framework for building desktop application |
| `electron-webpack`  |     2.6.2      |                    Improves development                     |
| `electron-builder`  |    20.40.2     |                                                             |
|       `react`       |     16.8.6     |                                                             |
|     `react-dom`     |     16.8.6     |                                                             |
|     `react-rnd`     |     9.1.2      |                                                             |
| `styled-components` |     4.2.0      |                                                             |
|   `gif-encoder-2`   |     1.0.0      |                  Create GIFs with Node.js                   |
|     `immutable`     |  4.0.0-rc.12   |                                                             |
|     `date-fns`      | 2.0.0-alpha.27 |                                                             |
|      `iohook`       |     0.4.6      |                                                             |
|     `archiver`      |     3.0.0      |                                                             |

## Features

### Screen Recorder

Capture fullscreen, or selected portion, frame-by-frame at a user set frame rate. This is accomplished using **Electron's** `desktopCapturer` with HTML video and canvas elements.

### Webcam Recorder

Capture webcam output at a user set size, frame-by-frame at a user set frame rate.

### Board Recorder

Capture canvas output as user draws onto white board.

### GIF Encoding

Combine all frames into a single GIF image.
