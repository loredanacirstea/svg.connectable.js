svg.connectable.js
==================
A JavaScript library for connecting SVG things.

[![](/connectable.png)](http://jsfiddle.net/L2sjjc3b/11/)

## Usage

This library depends on:

 - [SVG.js](https://github.com/wout/svg.js)
 - [svg.draggy.js](https://github.com/jillix/svg.draggy.js) (note this is the @jillix fork of the original *svg.draggable.js* project)


Different from original [jillix library](https://github.com/jillix/svg.connectable.js):

 - the connector can be any SVG Path element defined through use() (usually connectors are reused). See example. Note the two M points added for attachment precision.
 - you can define the [type of attachment](#setconnectorattachmentelement-type-c) (center, perifery) separate for source and target
 - you can have straight/curved connectors - available for the 'default' connector.
 - functions for changing the connection settings after initializing it.
 - padEllipse function from jillix is used automatically for ellipses ('perifery' attachment).

 Following example can be found and tested at: [https://jsfiddle.net/L2sjjc3b/11/](https://jsfiddle.net/L2sjjc3b/11/)


```html
<script src="path/to/svg.js"></script>
<script src="path/to/svg.draggy.js"></script>
<script src="path/to/svg.connectable.js"></script>
<script>
    var svg = new SVG($(".graph").get(0)).size("100%", 900);
    var links = svg.group();
    var markers = svg.group();
    var nodes = svg.group();
    var defs = svg.defs();

    var g1 = nodes.group().translate(400, 50).draggy();
    g1.circle(50).fill("#C2185B").opacity(0.8);

    var g2 = nodes.path('M171.5343780517578 146.06103515625L177.91102600097656 126.95043182373047L192.97349548339844 113.02484130859375L211.7304229736328 104.78312683105469L231.62428283691406 100.80436706542969L252.0863494873047 100.80436706542969L272.2646484375 104.78312683105469L291.021484375 113.02484130859375L306.0840148925781 126.95043182373047L312.33636474609375 145.99163818359375L306.0840148925781 165.3169708251953L291.021484375 178.95843505859375L272.2646484375 187.48428344726562L252.0863494873047 191.46316528320312L231.62428283691406 191.46316528320312L211.7304229736328 187.48428344726562L192.97349548339844 178.95843505859375L177.91102600097656 165.3169708251953L171.5343780517578 146.06103515625Z').fill("#E91E63").opacity(0.6)
    g2.draggy();

    var g3 = nodes.group().translate(20, 20).draggy();
    g3.circle(80).fill("#FF5252").opacity(0.4);

    //circles and ellipses use the jillix padEllipse algorithm for perifery points. Try it out with g3 without the container group:
    //var g3 = nodes.circle(80).fill("#FF5252").opacity(0.4).move(20,20);
    //g3.draggy();

    //parameters are optional - if you only provide the source and the target, you will get a straight path connecting the two elements' centers, with no marker(arrow), black ('#000000') color.

    var conn1 = g1.connectable({
        container: links,
        markers: markers,
        marker: 'default',
        targetAttach: 'perifery',
        color: '#2a88c9'
    }, g2);

    var conn2 = g2.connectable({
        targetAttach: 'perifery',
        sourceAttach: 'perifery',
        type: 'curved'
    }, g3);
    conn2.setConnectorColor("#00ff4a")
    conn2.setMarker('default',markers)


    // you can even use any path as a connector
    var connectorpath = 'M0.34603601694107056 13.719420433044434C19.039979934692383 13.31098747253418 43.52296447753906 16.02077865600586 30.993101119995117 -6.703379154205322C36.599334716796875 -11.906962394714355 57.15462112426758 1.2759649753570557 62.7608528137207 6.479549884796143C99.10176849365234 6.479549884796143 101.08106231689453 -10.086503982543945 162.15802001953125 11.319366455078125C96.03795623779297 31.165008544921875 100.22242736816406 19.279720306396484 63.88154983520508 19.279720306396484C63.88154983520508 19.279720306396484 48.56324005126953 33.8869514465332 33.84909439086914 36.53312301635742C41.52180480957031 11.509580612182617 18.957279205322266 16.413288116455078 0.4546089470386505 17.141387939453125Z '

    //for precision when using a path as a connector, you can add two points for using as source and target attachment points. If not, the default will be bbox().x+bbox().width/2, bbox().y for source  and be bbox().x+bbox().width/2, bbox().y2 (connector's bbox)
    var extraPointForSource = 'M0 15'
    var extraPointForTarget = 'M163 11.3'

    //usually you'd want to reuse the connector, so the library works with elements initialized through use()
    var connector = defs.path(extraPointForSource+extraPointForTarget+connectorpath).fill('#00ff4a').opacity(0.8)
    var connectorInUse = nodes.use(connector)
    var g4 = nodes.circle(20).fill('#000000').opacity(0.6).draggy()

    var conn3 = g4.connectable({
        connector: connectorInUse
    }, g3);

</script>
```

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
1. File an issue in the repository and provide an example for it (you can fork [this jsfiddle](https://jsfiddle.net/loredana_cirstea/19ucx6ru/2/) to reproduce the bug: ) or:
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## GPLv3 License

Copyright (c) 2015 Loredana Cirstea
Copyright (c) 2015 Christian Tzurcanu - Algorithm for creating connector curves, connector paths.

See the [LICENSE](./LICENSE) file.
