# GifIt

A JavaScript clone of the popular [**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif)

## Contents

- [**Objective**](#objective)
- [**Tech Stack**](#tech-stack)
- [**Features**](#features)
  - [**Screen Recorder**](#screen-recorder)
  - [**Webcam Recorder**](#webcam-recorder)
  - [**Editor**](#editor)
    - [**GIF Encoding**](#gif-encoding)

## Objective

[**ScreenToGif**](https://github.com/NickeManarin/ScreenToGif) is a popular (7000⭐) _.NET_ application that allows users to record GIFs from their screen, webcam or sketchboard. It is written primarily in _C#_. **ScreenToGif** is an exceptional application and I highly recommend you go and download it. This project an attempt to clone the original using JavaScript.

## Tech Stack

Outline of the main dependencies used in the application.

|       Library       | Version |                         Description                         |
| :-----------------: | :-----: | :---------------------------------------------------------: |
|     `electron`      |  5.0.1  | A cross platform framework for building desktop application |
| `electron-webpack`  |         |                    Improves development                     |
| `electron-builder`  |         |                                                             |
|       `react`       |         |                                                             |
|     `react-dom`     |         |                                                             |
|     `react-rnd`     |         |                                                             |
| `styled-components` |         |                                                             |
|     `immutable`     |         |                                                             |
|     `date-fns`      |         |                                                             |

## Features

### Screen Recorder

Capture the entire screen, or a selected portion, frame-by-frame at a user set frame rate.

### Webcam Recorder

Capture webcam output at a user set size, frame-by-frame at a user set frame rate.

### Editor

#### GIF Encoding

Combine all frames into a single GIF file with each frame persisting for an adjustable amount of time.

**GifIt** uses `gif-encoder` by default. This gets the job done but is time consuming (~25s per 100 images) and relatively inefficient, outputing large files (~12MB per 100 images). As an alternative, **GifIt** can use `ffmpeg` if it is installed locally on the user's machine. On load, **GifIt** will look in the user's _PATH_ for the `ffmpeg` executable, and if found will use it to encode GIFs. This results in a faster (~5s per 100 images) an smaller output (~750KB per 100 images). The user can also browser for and explicitly set a path to the `ffmpeg` executable in options.
