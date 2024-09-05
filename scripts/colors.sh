#!/usr/bin/env bash

color() {
	# Normal colors
	greenColor="\e[0;32m"
	redColor="\e[0;31m"
	blueColor="\e[0;34m"
	yellowColor="\e[0;33m"
	purpleColor="\e[0;35m"
	cyanColor="\e[0;36m"
	grayColor="\e[0;37m"

	# Bold colors
	greenBold="\e[1;32m"
	redBold="\e[1;31m"
	blueBold="\e[1;34m"
	yellowBold="\e[1;33m"
	purpleBold="\e[1;35m"
	cyanBold="\e[1;36m"
	grayBold="\e[1;37m"

	endColor="\e[0m"

	# Symbols
	plus="${greenBold}[+]${endColor}"
	error="${redBold}[x]${endColor}"
	warning="${yellowBold}[!]${endColor}"
	question="${cyanBold}[?]${endColor}"
	dash="${purpleBold}-${endColor}"
	double_dash="${purpleBold}--${endColor}"
	open_bracket="${purpleColor}[${endColor}"
	close_bracket="${purpleColor}]${endColor}"
	open_parenthesis="${purpleColor}(${endColor}"
	close_parenthesis="${purpleColor})${endColor}"
	double_dot="${cyanBold}:${endColor}"
	open_angle="${cyanColor}<${endColor}"
	close_angle="${cyanColor}>${endColor}"
	double_colon="${cyanBold}::${endColor}"
	comma="${purpleColor},${endColor}"
}

# initialize colors 
color
