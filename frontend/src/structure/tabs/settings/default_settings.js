// This file is auto generated from the default settings file. 
// To generate a new version from the existing default values use the script: ./dev_tools/build_default_settings.py

const default_settings = {
	serial: {
		port: {
			name: "serial.port",
			type: "select",
			value: "FAKE",
			label: "Serial port",
			available_values: ['FAKE']
		},
		baud: {
			name: "serial.baud",
			type: "select",
			value: "115200",
			label: "Serial baudrate",
			available_values: ['2400', '4800', '9600', '19200', '38400', '57600', '115200', '230400', '460800', '921600']
		},
		fast_mode: {
			name: "serial.fast_mode",
			type: "check",
			value: false,
			label: "Enable fast mode",
			tip: "Will make the command as short as possible to have a faster communication (will remove spaces and unnecessary line numbers)"
		}
	},
	device: {
		firmware: {
			name: "device.firmware",
			type: "select",
			value: "Marlin",
			available_values: ['Marlin', 'Grbl'],
			label: "Select firmware type"
		},
		type: {
			name: "device.type",
			type: "select",
			value: "Cartesian",
			available_values: ['Cartesian', 'Scara', 'Polar (not tested yet)'],
			label: "Select device type"
		},
		width: {
			name: "device.width",
			type: "input",
			value: 100,
			label: "Device width",
			depends_on: "device.type",
			depends_values: ['Cartesian']
		},
		height: {
			name: "device.height",
			type: "input",
			value: 100,
			label: "Device height",
			depends_on: "device.type",
			depends_values: ['Cartesian']
		},
		radius: {
			name: "device.radius",
			type: "input",
			value: 200,
			label: "Device radius",
			depends_on: "device.type",
			depends_values: ['Polar', 'Scara']
		},
		angle_conversion_factor: {
			name: "device.angle_conversion_factor",
			type: "input",
			value: 6,
			label: "Angle conversion factor",
			depends_on: "device.type",
			depends_values: ['Polar', 'Scara']
		},
		offset_angle_1: {
			name: "device.offset_angle_1",
			type: "input",
			value: -1.5,
			label: "Insert angular position homing offset",
			depends_on: "device.type",
			depends_values: ['Polar', 'Scara']
		},
		offset_angle_2: {
			name: "device.offset_angle_2",
			type: "input",
			value: 1.5,
			label: "Insert second arm homing position offset",
			depends_on: "device.type",
			depends_values: ['Scara']
		}
	},
	scripts: {
		connected: {
			name: "scripts.connected",
			type: "text",
			value: "",
			label: "On connection"
		},
		before: {
			name: "scripts.before",
			type: "text",
			value: "",
			label: "Before drawing"
		},
		after: {
			name: "scripts.after",
			type: "text",
			value: "",
			label: "After drawing"
		}
	},
	system: {
		is_linux: false
	},
	leds: {
		width: {
			name: "leds.width",
			type: "input",
			value: 30,
			label: "Leds number on the largest side"
		},
		height: {
			name: "leds.height",
			type: "input",
			value: 20,
			label: "Leds number on the smallest side"
		},
		type: {
			name: "leds.type",
			type: "select",
			value: "Dimmable",
			available_values: ['WS2812B', 'Dimmable'],
			label: "Select a led type"
		},
		pin1: {
			name: "leds.pin1",
			type: "input",
			value: 18,
			label: "Pin number"
		}
	}
}

export default default_settings;