# Starcar

Starcar is a personal project for recording and displaying data recorded from my car. The data is then intended to be used with analysis to determine characteristics of the car. 

![Starcar overview](https://github.com/pateichler/starcar/blob/main/starcar_screenshot.png)

## Goal of project

The goal of the project was to do analysis specifically on my two front struts of my car. The analysis I had in mind was to compute the damping ratio of the car struts based on data recorded from Strain Gauges attached to the car strut. Unfortunately, I never got around to doing the analysis part of the project, but the rest of the project works for data recording and displaying of strain gauge data.

## Structure

![Starcar overview](https://github.com/pateichler/starcar/blob/main/starcar_overview.png)

This repository contains the services for the backend, frontend, and example analysis container. The code for the data acquisition of the strain gauges is in the [Starcar Transmitter](https://github.com/pateichler/starcar-transmitter) repository.

### Backend

The backend is built with Python Flask. It is interacted through a simple API to post and receive data.


### Frontend

The frontend is built with Next.js and React. The frontend uses the backend API to display recorded data to the client.
