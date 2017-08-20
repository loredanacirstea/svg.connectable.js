var svg = SVG('svg1').size("100%", 900);
var links = svg.group();
var markers = svg.group();
var nodes = svg.group();
var defs = svg.defs();

var g1 = nodes.group().translate(400, 50).draggy();
g1.circle(50).fill("#C2185B").opacity(0.8);

var g2 = nodes.path('M230.59140014648438 334.4753723144531L246.7823944091797 279.7633972167969L301.40234375 300.3238067626953L229.5858612060547 334.8314208984375Z ').fill("#E91E63").opacity(0.6)
g2.draggy();

var g3 = nodes.group().translate(20, 20).draggy();
g3.circle(80).fill("#FF5252").opacity(0.4);

//var g3 = nodes.circle(80).fill("#FF5252").opacity(0.4).move(20,20);
//g3.draggy();

var g4 = nodes.circle(20).fill('#000000').opacity(0.6).draggy()

var connectorpath = 'M0.34603601694107056 13.719420433044434C19.039979934692383 13.31098747253418 43.52296447753906 16.02077865600586 30.993101119995117 -6.703379154205322C36.599334716796875 -11.906962394714355 57.15462112426758 1.2759649753570557 62.7608528137207 6.479549884796143C99.10176849365234 6.479549884796143 101.08106231689453 -10.086503982543945 162.15802001953125 11.319366455078125C96.03795623779297 31.165008544921875 100.22242736816406 19.279720306396484 63.88154983520508 19.279720306396484C63.88154983520508 19.279720306396484 48.56324005126953 33.8869514465332 33.84909439086914 36.53312301635742C41.52180480957031 11.509580612182617 18.957279205322266 16.413288116455078 0.4546089470386505 17.141387939453125Z '
var extraPointForSource = 'M0 15'
var extraPointForTarget = 'M163 11.3'

var connector = defs.path(extraPointForSource+extraPointForTarget+connectorpath).fill('#00ff4a').opacity(0.8)

var conn1 = g1.connectable({
    container: links,
    markers: markers,
    marker: 'default',
    targetAttach: 'perifery',
    //sourceAttach: 'perifery',
    color: '#2a88c9'
}, g2);

/*
var g11 = nodes.circle(50).fill("#C2185B").opacity(0.8);
g11.move(400, 150).draggy();
var conn11 = g11.connectable({
    container: links,
    markers: markers,
    marker: 'default',
    targetAttach: 'perifery',
    sourceAttach: 'perifery',
    color: '#2a88c9'
}, g2);
*/

var conn2 = g2.connectable({
    targetAttach: 'perifery',
    sourceAttach: 'perifery',
    type: 'curved'
}, g3);
conn2.setConnectorColor("#00ff4a")
conn2.setMarker('default',markers)

var connectorInUse = nodes.use(connector)

var conn3 = g4.connectable({
    connector: connectorInUse,
    //targetAttach: 'perifery',
    //sourceAttach: 'perifery',
}, g3);
