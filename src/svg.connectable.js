/*!
 * SVG.js Connectable Plugin
 * =========================
 *
 * A JavaScript library for connecting SVG things.
 * Forked from https://github.com/jillix/svg.connectable.js
 * Modified by Loretek. Algorithm for creating connector curves from Christian Tzurcanu (https://github.com/ctzurcanu)
 *
 * svg.connectable.js 1.0.1
 * Licensed under the MIT license.
 * */
;(function() {

    var container = null;
    var markers = null;

    /**
     * connectable
     * Connects two elements.
     *
     * @name connectable
     * @function
     * @param {Object} options An object containing any of the following fields:
     *
     *  - `container` (SVGElement): The connector elements container. Defaults to source parent.
     *  - `markers` (SVGElement): The marker elements container. Defaults to source parent.
     *  - `sourceAttach` (String): Connector attachment for source element: 'center' / 'perifery'. Defaults to 'center'
     *  - `targetAttach` (String): Connector attachment for target element: 'center' / 'perifery'. Defaults to 'center'
     *  - `type` (String): Connector type: 'straight' or 'curved'. Defaults to 'straight'
     *  - `marker` (String): Can be: an SVGElement / 'null' / 'default'. Defaults to 'null'
     *  - `color` (String): Connector color. Defaults to '#000000'.
     *
     * @param {SVGElement} elmTarget The target SVG element.
     * @return {Object} The connectable object containing:
     *
     *  - `source` (SVGElement): The source element.
     *  - `target` (SVGElement): The target element.
     *  - `connector` (SVGElement): The connector element (line / path / polygon).
     *  - `marker` (SVGElement): The marker element.
     *  - [`computeConnectorCoordinates` (Function)](#computeconnectorcoordinatescon)
     *  - [`update` (Function)](#update)
     *  - [`setConnectorColor` (Function)](#setconnectorcolorcolor-c)
     *  - [`setMarker`] (Function)](#setmarker)
     *  - [`setConnectorAttachment`] (Function)](#setconnectorattachment)
     *  - [`setConnector`] (Function)](#setconnector)
     *  - [`setType`] (Function)](#settype)
     */

    function connectable(options, elmTarget) {

        var con = {};

        if (elmTarget === undefined) {
            elmTarget = options;
            options = {};
        }

        container = options.container || this.parent || container;
        var elmSource = this;
        markers = options.markers || this.parent || markers;

        // Append the SVG elements
        con.source = elmSource; //'center', 'perifery'
        con.target = elmTarget;
        con.type = options.type || 'straight' //'straight', 'curved'
        if(options.connector && options.connector.target.type == 'path'){
            con.connector = options.connector
            var patharr = con.connector.target.array.valueOf()
            if(!(patharr[1][0] == 'M') || !(patharr[2][0] == 'M')){
                var box = con.connector.target.bbox();
                patharr.splice(0,0,['M', box.x+box.width/2, box.y], ['M', box.x + box.width/2, box.y2]);
                con.connector.target.plot(patharr);
            }
        }
        else
            con.connector = container.path().attr('connectortype', 'default').fill('none');

        con.sourceAttach = options.sourceAttach || 'center'
        con.targetAttach = options.targetAttach || 'center'
        con.color = options.color || '#000000'


        /**
         * setMarker
         * The function that sets the marker
         * It can be an SVGElement / 'default' / 'null'
         *
         * @name setMarker
         * @function
         * @param {String} SVGElement / 'default' / 'null'
         * @param {SVGElement} markers Optional parent for the marker element.
         * @return {Connectable} The connectable instance.
         */
        con.setMarker = function(marker, markers, c){
            c = c || this;

            if(markers)
                    c.markers = markers;
            if(!marker || marker == 'null'){
                c.marker = null
                if(c.connector.attr("marker-end")){
                    var markerid = c.connector.attr("marker-end");
                    SVG.get(markerid.slice(5, markerid.length-1)).remove();
                    c.connector.removeClass("marker-end");
                }
            }
            else if(marker == 'default'){
                var marker = c.markers.marker(30, 30);
                var markerId = "triangle-" + Math.random().toString(16);
                c.connector.attr("marker-end", "url(#" + markerId + ")");

                marker.attr({
                    id: markerId,
                    viewBox: "0 0 30 30",
                    refX: "30",
                    refY: "15",
                    markerUnits: "strokeWidth",
                    markerWidth: "12",
                    markerHeight: "15"
                });

                marker.path().attr({
                    d: "M 0 0 L 30 15 L 0 30 z"
                });

                c.marker = marker;
                c.marker.fill(c.color);
            }
            else
                c.marker = marker
            return c;
        }

        con.setMarker(options.marker, options.markers);


        /**
         * computeConnectorCoordinates
         * The function that computes the new coordinates.
         *
         * @name computeConnectorCoordinates
         * @function
         * @param {Connectable} con The connectable instance.
         * @return {Object} An object containing the connector path array.
         */
        con.computeConnectorCoordinates = function (con) {
            con = con || this;
            var temp = {}, p;
            var sPos = con.source.bbox();
            var tPos = con.target.bbox();

            if(con.sourceAttach == 'center')
                temp.point1 = [sPos.x + sPos.width / 2, sPos.y + sPos.height / 2]
            else if(con.source.type == 'ellipse'){

                // Get ellipse radius
                var xR1 = parseFloat(con.source.attr('rx'));
                var yR1 = parseFloat(con.source.attr('ry'));

                // Get centers
                var sx = con.source.cx()
                var sy = con.source.cy()

                var tx = con.target.cx()
                var ty = con.target.cy()

                // Calculate distance from source center to target center
                var dx = tx - sx;
                var dy = ty - sy;
                var d = Math.sqrt(dx * dx + dy * dy);

                // Construct unit vector between centers
                var ux = dx / d;
                var uy = dy / d;

                // Point on source circle
                var x1 = sx + xR1 * ux;
                var y1 = sy + yR1 * uy;

                temp.point1 = [x1 + xR1 / 2, y1 + yR1 / 2]
            }
            else if(con.source.type == 'path'){
                var arr1 = JSON.parse(JSON.stringify(con.source.array.valueOf()));
                if(arr1[arr1.length-1][0] == 'Z')
                    arr1.splice(arr1.length-1,1)
                var arr = arr1;
                var point = 'point2'
            }
            else{
                var arr1 = [
                    ['M', sPos.x + sPos.width / 2, sPos.y],
                    ['L', sPos.x + sPos.width, sPos.y + sPos.height / 2],
                    ['L', sPos.x + sPos.width / 2, sPos.y + sPos.height],
                    ['L', sPos.x, sPos.y + sPos.height / 2]
                ]
                var arr = arr1
                var point = 'point2'
            }


            if(con.targetAttach == 'center')
                temp.point2 = [tPos.x + tPos.width / 2, tPos.y + tPos.height / 2]
            else if(con.source.type == 'ellipse'){
                // Get ellipse radius
                var xR2 = parseFloat(con.target.attr('rx'));
                var yR2 = parseFloat(con.target.attr('ry'));

                // Get centers
                var sx = con.source.cx()
                var sy = con.source.cy()

                var tx = con.target.cx()
                var ty = con.target.cy()

                // Calculate distance from source center to target center
                var dx = tx - sx;
                var dy = ty - sy;
                var d = Math.sqrt(dx * dx + dy * dy);

                // Construct unit vector between centers
                var ux = dx / d;
                var uy = dy / d;

                // Point on target circle
                var x2 = sx + (d - xR2 - 5) * ux;
                var y2 = sy + (d - yR2 - 5) * uy;

                temp.point2 = [x2 + xR2 / 2, y2 + yR2 / 2]
            }
            else if(con.source.type == 'path'){
                var arr2 = JSON.parse(JSON.stringify(con.target.array.valueOf()));
                if(arr2[arr2.length-1][0] == 'Z')
                    arr2.splice(arr2.length-1,1)
                var arr = arr2;
                var point = 'point1'
            }
            else{
                var arr2 = [
                    ['M', tPos.x + tPos.width / 2, tPos.y],
                    ['L', tPos.x + tPos.width, tPos.y + tPos.height / 2],
                    ['L', tPos.x + tPos.width / 2, tPos.y + tPos.height],
                    ['L', tPos.x, tPos.y + tPos.height / 2]
                ]
                var arr = arr2
                var point = 'point1'
            }

            if(!temp.point1 || !temp.point2){
                temp.min = Number.MAX_SAFE_INTEGER;
                if(!temp.point1 && !temp.point2)
                    for(var i = 0 ; i < arr1.length; i++){
                        for(var j = 0 ; j < arr2.length; j++){
                            var dist = Math.pow((arr2[j][arr2[j].length-2] - arr1[i][arr1[i].length-2]),2) + Math.pow((arr2[j][arr2[j].length-1] - arr1[i][arr1[i].length-1]),2)
                            if(temp.min > dist){
                                temp.min = dist
                                temp.point1 = [arr1[i][arr1[i].length-2], arr1[i][arr1[i].length-1]]
                                temp.point2 = [arr2[j][arr2[j].length-2], arr2[j][arr2[j].length-1]]
                            }
                        }
                    }
                else{
                    point = temp[point];
                    for(var i = 0 ; i < arr.length; i++){
                        var dist = Math.pow((point[0] - arr[i][arr[i].length-2]),2) + Math.pow((point[1] - arr[i][arr[i].length-1]),2)
                        if(temp.min > dist){
                            temp.min = dist
                            temp.point = [arr[i][arr[i].length-2], arr[i][arr[i].length-1]]
                        }
                    }
                    if(!temp.point1)
                        temp.point1 = temp.point
                    else
                        temp.point2 = temp.point
                }
            }

            var pp1 = temp.point1
            var pp2 = temp.point2

            if(con.type == 'curved'){
                var c1 = {x: con.source.cx(), y: con.source.cy()}
                var c2 = {x: con.target.cx(), y: con.target.cy()}

                if(Math.abs(pp1[0] - c1.x) > 0.5){
                    var m1 = (pp1[1] - c1.y) / (pp1[0] - c1.x)
                    var b1 = pp1[1] - m1 * pp1[0];

                    if(Math.abs(pp2[0] - pp1[0]) < Math.abs(pp2[1] - pp1[1])){
                        var x1 = pp1[0] + (pp2[0] - pp1[0]) / 5
                        var attr1 = {x: x1, y: m1 * x1 + b1}
                    }
                    else if(Math.abs(pp1[1] - c1.y) > 0.5){
                        var y1 = pp1[1] + (pp2[1] - pp1[1]) / 5
                        var attr1 = {x: (y1 - b1) / m1, y: y1}
                    } 
                    else
                        var attr1 = {x: pp1[0] + Math.sign(pp2[0]-pp1[0]) * Math.abs((pp2[1] - pp1[1]) / 5), y: pp1[1]}                 
                }
                else
                    var attr1 = {x: pp1[0], y: pp1[1] + (pp2[1] - pp1[1]) / 5}

                if(Math.abs(pp2[0] - c2.x) > 0.5){
                    var m2 = (pp2[1] - c2.y) / (pp2[0] - c2.x)
                    var b2 = pp2[1] - m2 * pp2[0];

                    if(Math.abs(pp2[0] - pp1[0]) < Math.abs(pp2[1] - pp1[1])){
                        var x2 = pp2[0] - (pp2[0] - pp1[0]) / 5
                        var attr2 = {x: x2, y: m2 * x2 + b2}
                    }
                    else if(Math.abs(pp2[1] - c2.y) > 0.5){
                        var y2 = pp2[1] - (pp2[1] - pp1[1]) / 5
                        var attr2 = {x: (y2 - b2) / m2, y: y2}
                    }
                    else
                        var attr2 = {x: pp2[0] - Math.sign(pp2[0]-pp1[0]) * Math.abs((pp2[1] - pp1[1]) / 5), y: pp2[1]}   
                }
                else
                    var attr2 = {x: pp2[0], y: pp2[1] - (pp2[1] - pp1[1]) / 5}

                var middle = {x: attr1.x + (attr2.x - attr1.x) / 2, y: attr1.y + (attr2.y - attr1.y) / 2}

                var points = [
                    ['M', pp1[0], pp1[1]],
                    ['C', attr1.x, attr1.y, attr1.x, attr1.y, middle.x, middle.y],
                    ['C', attr2.x, attr2.y, attr2.x, attr2.y, pp2[0], pp2[1]]
                ]  
            }
            else
                var points = [
                    ['M', pp1[0], pp1[1]],
                    ['L', pp2[0], pp2[1]]
                ]
            return points;
        };

        elmSource.cons = elmSource.cons || [];
        elmSource.cons.push(con);

        /**
         * update
         * Updates the connector's path
         *
         * @name update
         * @function
         * @return {undefined}
         */
       con.update = function () {
            if(con.connector.attr('connectortype') == 'default'){
                con.connector.plot(con.computeConnectorCoordinates(con))
            }
            else{
                var arr = con.connector.target.array.valueOf();

                //find connector's attachment points
                var path = con.computeConnectorCoordinates(con)
                var pp1 = [path[0][1], path[0][2]]
                var pp2 = [path[path.length-1][path[path.length-1].length-2], path[path.length-1][path[path.length-1].length-1]]

                //compare line(between attachment points) lengths for scale
                var newdiag = Math.sqrt(Math.pow((pp2[0] - pp1[0]),2) + Math.pow((pp2[1] - pp1[1]),2))
                var olddiag = Math.sqrt(Math.pow((arr[1][1] - arr[0][1]),2) + Math.pow((arr[1][2] - arr[0][2]),2))

                var scale = newdiag / olddiag

                //new angle of connector
                var angle = Math.atan((pp2[1] - pp1[1]) / (pp2[0] - pp1[0]))
                if(angle > 0 && pp2[1] < pp1[1])
                    angle = Math.PI + angle
                else if(angle < 0 && pp2[1] > pp1[1] && pp2[0] < pp1[0])
                    angle = Math.PI + angle

                //new center coordinates for the connector
                var tcenter = {x: pp1[0] + (pp2[0]-pp1[0]) / 2, y: pp1[1] + (pp2[1]-pp1[1]) / 2}
                
                //get original angle and center of the connector
                var originalangle = Math.atan((arr[1][2] - arr[0][2]) / (arr[1][1] - arr[0][1]))
                var center = {x: con.connector.target.cx(), y: con.connector.target.cy()}

                //initialize matrix with translation from original center to the new center
                var m = [1, 0, 0, 1, tcenter.x - center.x, tcenter.y - center.y];
                
                //rotate translated matrix
                var aa = m[0],
                    ab = m[1],
                    ac = m[2],
                    ad = m[3],
                    atx = m[4],
                    aty = m[5],
                    st = Math.sin(-angle+originalangle),
                    ct = Math.cos(-angle+originalangle)
                //first translate back to origin (0,0) by deducting new center coordinates
                atx = - aa * tcenter.x - ac * tcenter.y + atx
                aty = - ab * tcenter.x - ad * tcenter.y + aty
                //matrix rotation algorithm
                m[0] = aa*ct + ab*st;
                m[1] = -aa*st + ab*ct;
                m[2] = ac*ct + ad*st;
                m[3] = -ac*st + ct*ad;
                m[4] = ct*atx + st*aty;
                m[5] = ct*aty - st*atx;
                //translate to new center coordinates
                m[4] = aa * tcenter.x + ac * tcenter.y + m[4]
                m[5] = ab * tcenter.x + ad * tcenter.y + m[5]
                
                //translate neutral matrix to origin by deducting original center coordinated then scale and translate again to original center 
                var aa = 1,
                    ab = 0,
                    ac = 0,
                    ad = 1,
                    atx = (- aa * center.x - ac * center.y) * scale,
                    aty = (- ab * center.x - ad * center.y) * scale,
                    sm = []

                sm[0] = aa * scale
                sm[1] = ab * scale
                sm[2] = ac * scale
                sm[3] = ad * scale
                sm[4] = aa * center.x + ac * center.y + atx
                sm[5] = ab * center.x + ad * center.y + aty

                //multiply scaled matrix with rotated matrix

                var matrix = [];

                matrix[0] = sm[0]*m[0] + sm[1]*m[2];
                matrix[1] = sm[0]*m[1] + sm[1]*m[3];
                matrix[2] = sm[2]*m[0] + sm[3]*m[2];
                matrix[3] = sm[2]*m[1] + sm[3]*m[3];
                matrix[4] = m[0]*sm[4] + m[2]*sm[5] + m[4];
                matrix[5] = m[1]*sm[4] + m[3]*sm[5] + m[5];

                con.connector.transform('matrix', matrix.join(','));
            }
        };
        con.update();

        elmSource.on("dragmove", con.update);
        elmTarget.on("dragmove", con.update);

        /**
         * setConnectorColor
         * Sets the connector color.
         *
         * @name setConnectorColor
         * @function
         * @param {String} color The new color.
         * @param {Connectable} c The connectable instance.
         * @return {undefined}
         */
        con.setConnectorColor = function (color, c) {
            c = c || this;
            c.color = color;
            c.connector.stroke(color);
            if(c.marker)
                c.marker.fill(color);
        };
        con.setConnectorColor(con.color)

        /**
         * setConnectorAttachment
         * Sets the connector's attachment type.
         *
         * @name setConnectorAttachment
         * @function
         * @param {String} element Can be either 'source' or 'target'
         * @param {String} type Can be either 'center' or 'perifery'
         * @param {Connectable} c The connectable instance.
         * @return {undefined}
         */
        con.setConnectorAttachment = function(element, type, c){
            c = c || this;
            c[element+'Attach'] = type;
            c.update();
        }

        /**
         * setConnector
         * Sets the connector
         *
         * @name setConnector
         * @function
         * @param {SVGElement} connector Can be either an SVGElement or 'default'
         * @param {Connectable} c The connectable instance.
         * @return {undefined}
         */
        con.setConnector = function(connector, c){
            c = c || this;
            if(connector){
                c.connector.remove();
                if(connector == 'default'){
                    c.connector = container.path().attr('connectortype', 'default').fill('none');
                    c.setConnectorColor(c.color);
                }
                else
                    c.connector = connector;
                c.update();
            }
        }

        /**
         * setType
         * Sets the connector's type.
         *
         * @name setType
         * @function
         * @param {String} type Can be either 'straight' or 'curved'
         * @param {Connectable} c The connectable instance.
         * @return {undefined}
         */
        con.setType = function(type, c){
            c = c || this;
            if(['straight', 'curved'].indexOf(type) != -1){
                if(c.type != type){
                    c.type = type;
                    c.update();
                }
            }
        }

        return con;
    }

    SVG.extend(SVG.Element, {
        connectable: connectable
    });
}).call(this);
