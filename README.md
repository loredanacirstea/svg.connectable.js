svg.connectable.js
==================
A JavaScript library for connecting SVG things.

[![](/connectable.png)](http://jsfiddle.net/L2sjjc3b/11/)


## Usage

Following example can be tested in the following jsfiddle: [https://jsfiddle.net/L2sjjc3b/80/](https://jsfiddle.net/L2sjjc3b/80/)

Example source code also in https://github.com/loredanacirstea/svg.connectable.js/tree/master/example.

This library depends on:

 - [SVG.js](https://github.com/svgdotjs/svg.js)
 - [svg.draggy.js](https://github.com/jillix/svg.draggy.js) (note this is the @jillix fork of the original *svg.draggable.js* project)


Different from original [jillix library](https://github.com/jillix/svg.connectable.js):

 - the connector can be any SVG Path element defined through use() (usually connectors are reused). See example. Note the two M points added for attachment precision.
 - you can define the [type of attachment](#setconnectorattachmentelement-type-c) (center, perifery) separate for source and target
 - you can have straight/curved connectors - available for the 'default' connector.
 - functions for changing the connection settings after initializing it.
 - padEllipse function from jillix is used automatically for ellipses ('perifery' attachment).


## Documentation

### `connectable(options, elmTarget)`
Connects two elements.

#### Params
- **Object** `options`: An object containing any of the following fields:
 - `container` (SVGElement): The connector elements container. Defaults to source parent.
 - `markers` (SVGElement): The marker elements container. Defaults to source parent.
 - `sourceAttach` (String): Connector attachment for source element: 'center' / 'perifery'. Defaults to 'center'
 - `targetAttach` (String): Connector attachment for target element: 'center' / 'perifery'. Defaults to 'center'
 - `type` (String): Connector type: 'straight' or 'curved'. Defaults to 'straight'
 - `marker` (String/SVGElement): Can be: an SVGElement / 'null' / 'default'. Defaults to 'null'
 - `color` (String): Connector color. Defaults to '#000000'

- **SVGElement** `elmTarget`: The target SVG element.

#### Return
- **Object** The connectable object containing:
 - `source` (SVGElement): The source element.
 - `target` (SVGElement): The target element.
 - `connector` (SVGElement): The connector element.
 - `marker` (SVGElement): The marker element.
 - [`computeConnectorCoordinates` (Function)](#computeconnectorcoordinatescon)
 - [`update` (Function)](#update)
 - [`setConnectorColor` (Function)](#setconnectorcolorcolor-c)
 - [`setMarker` (Function)](#setmarkermarker-markers-c)
 - [`setConnectorAttachment` (Function)](#setconnectorattachmentelement-type-c)
 - [`setConnector` (Function)](#setconnectorconnector-c)
 - [`setType` (Function)](#settypetype-c)

### `computeConnectorCoordinates(con)`
The function that computes the new coordinates.
It can be overriden with a custom function.

#### Params
- **Connectable** `con`: The connectable instance.

#### Return
- **Object** Returns the new SVG PathArray for the connector.

### `update()`
Updates the line coordinates.

### `setConnectorColor(color, c)`
Sets the connector and marker color.

#### Params
- **String** `color`: The new color.
- **Connectable** `c`: The connectable instance. Optional

### `setMarker(marker, markers, c)`
Sets the marker

#### Params
- **SVGElement/String** `marker`: New marker element / 'null' / 'default'.
- **SVGElement** `markers`: Group parent for markers. Defaults to source.parent
- **Connectable** `c`: The connectable instance. Optional.

### `setConnectorAttachment(element, type, c)`
Sets the connector's type of attachment.

#### Params
- **String** `element`: 'source' / 'target'
- **String** `type`: 'center' / 'perifery'. For paths, the 'perifery' option takes the PathArray point which is closest to the source/target attachment point. For ellipses, it uses the jillix algorithm for padEllipse (padding area aorund the ellipse). For all other, it uses the 4 middle side points from the bbox() rectangle.
- **Connectable** `c`: The connectable instance. Optional.

### `setConnector(connector, c)`
Sets the connector.

#### Params
- **SVGElement/String** `connector`: New connector element / 'default'.
- **Connectable** `c`: The connectable instance. Optional.

### `setType(type, c)`
Sets the connector and marker color.

#### Params
- **String** `type`: Connector type for default connector: 'straight' / 'curved'. Defaults to 'straight'
- **Connectable** `c`: The connectable instance. Optional.

## How to contribute
1. File an issue in the repository and provide an example for it (you can fork the example jsfiddle to reproduce the bug) or:
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## MIT License

See the [LICENSE](./LICENSE) file.
