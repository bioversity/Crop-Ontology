var graph       = {},
    selected    = {},
    highlighted = null,
    isIE        = false,
    filename		= 'D3 Process Map',
    fitOnStart	= true;

$(function() {
    resize();

    isIE = $.browser.msie;

    if ($.browser.mozilla) {
        $('body').addClass('firefox');
    }

    d3.json(config.jsonUrl)
        .then(function(data) {
            if (data.errors.length) {
                alert('Data error(s):\n\n' + data.errors.join('\n'));
                return;
            }

            graph.data = data.data;
            drawGraph();

        })

    $('#docs-close').on('click', function() {
        deselectObject();
        return false;
    });

    $(document).on('click', '.select-object', function() {
        var obj = graph.data[$(this).data('name')];
        if (obj) {
            selectObject(obj);
        }
        return false;
    });

    $(window).on('resize', resize);

    function waitForGraphData() {
        if ($("#rootG").length) {
            lapsedZoomFit(undefined, 0);
        }
        else{
            setTimeout(waitForGraphData, 1000);
        }
    }
    if (fitOnStart) waitForGraphData();//setTimeout(waitForGraphData, 3000);

});

function drawGraph() {

    $('#graph').empty();

    graph.margin = {
        top    : 20,
        right  : 20,
        bottom : 20,
        left   : 20
    };

    var
        minZoom = 0.1,
        maxZoom = 4;

    var display = $('#graph').css('display');
    $('#graph')
        .css('display', 'block')
        .css('height', config.graph.height + 'px');
    graph.width  = $('#graph').width()  - graph.margin.left - graph.margin.right;
    graph.height = $('#graph').height() - graph.margin.top  - graph.margin.bottom;
    $('#graph').css('display', display);

    for (var name in graph.data) {
        var obj = graph.data[name];
        obj.positionConstraints = [];
        obj.linkStrength        = 1;

        config.constraints.forEach(function(c) {
            for (var k in c.has) {
                if (c.has[k] !== obj[k]) {
                    return true;
                }
            }

            switch (c.type) {
                case 'position':
                    obj.positionConstraints.push({
                        weight : c.weight,
                        x      : c.x * graph.width,
                        y      : c.y * graph.height
                    });
                    break;

                case 'linkStrength':
                    obj.linkStrength *= c.strength;
                    break;
            }
        });
    }

    graph.links = [];
    for (var name in graph.data) {
        var obj = graph.data[name];
        for (var depIndex in obj.depends) {
            var link = {
                source : graph.data[obj.depends[depIndex]],
                target : obj
            };
            link.strength = (link.source.linkStrength || 1)
                * (link.target.linkStrength || 1);
            graph.links.push(link);
        }
    }

    graph.categories = {};
    for (var name in graph.data) {
        var obj = graph.data[name],
            key = obj.type + ':' + (obj.group || ''),
            cat = graph.categories[key];

        obj.categoryKey = key;
        if (!cat) {
            cat = graph.categories[key] = {
                key      : key,
                type     : obj.type,
                typeName : (config.types[obj.type]
                    ? config.types[obj.type].short
                    : obj.type),
                group    : obj.group,
                count    : 0
            };
        }
        cat.count++;
    }
    graph.categoryKeys = Object.keys(graph.categories);

    graph.colors = colorbrewer.Set3[config.graph.numColors];

    function getColorScale(darkness) {
        return d3.scaleOrdinal()
            .domain(graph.categoryKeys)
            .range(graph.colors.map(function(c) {
                return d3.hsl(c).darker(darkness).toString();
            }));
    }

    graph.strokeColor = getColorScale( 0.7);
    graph.fillColor   = getColorScale(-0.1);

    graph.nodeValues = Object.values(graph.data);
    /*
graph.forceSim = d3.layout.force()
    .nodes(graph.nodeValues)
    .links(graph.links)
    .linkStrength(function(d) { return d.strength; })
    .size([graph.width, graph.height])
    .linkDistance(config.graph.linkDistance)
    .charge(config.graph.charge)
    .on('tick', tick);
    */
    graph.forceSim = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function(d) { return d.index; })
            .distance(config.graph.linkDistance)
            .strength(function (d) { return d.strength; }))
        .force("charge", d3.forceManyBody().strength(config.graph.charge))
        .force("center", d3.forceCenter( graph.width/2, graph.height/2 ));
    if (config.graph.preventColls == "false") {
        console.log("False je!");
        graph.forceSim
            .force("collision", d3.forceCollide().strength(1).radius(config.graph.collide));
    }
    //.force('collision', d3.forceCollide().radius(depthRadius));

    graph.forceSim
        .nodes(graph.nodeValues)
        .on("tick", tick);

    graph.forceSim
        .force("link")
        .links(graph.links);

    graph.svg = d3.select('#graph').append('svg')
        .attr('width' , graph.width  + graph.margin.left + graph.margin.right)
        .attr('height', graph.height + graph.margin.top  + graph.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + graph.margin.left + ',' + graph.margin.top + ')');

    graph.svg.append('defs').selectAll('marker')
        .data(['end'])
        .enter().append('marker')
        .attr('id'          , String)
        .attr('viewBox'     , '0 -5 10 10')
        .attr('refX'        , 10)
        .attr('refY'        , 0)
        .attr('markerWidth' , 6)
        .attr('markerHeight', 6)
        .attr('orient'      , 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

    // adapted from http://stackoverflow.com/questions/9630008
    // and http://stackoverflow.com/questions/17883655

    var glow = graph.svg.append('filter')
        .attr('x'     , '-50%')
        .attr('y'     , '-50%')
        .attr('width' , '200%')
        .attr('height', '200%')
        .attr('id'    , 'blue-glow');

    glow.append('feColorMatrix')
        .attr('type'  , 'matrix')
        .attr('values', '0 0 0 0  0 '
            + '0 0 0 0  0 '
            + '0 0 0 0  .7 '
            + '0 0 0 1  0 ');

    glow.append('feGaussianBlur')
        .attr('stdDeviation', 3)
        .attr('result'      , 'coloredBlur');

    glow.append('feMerge').selectAll('feMergeNode')
        .data(['coloredBlur', 'SourceGraphic'])
        .enter().append('feMergeNode')
        .attr('in', String);

    graph.legend = graph.svg.append('g')
        .attr('class', 'legend')
        .attr('x', 0)
        .attr('y', 0)
        .selectAll('.category')
        .data(Object.values(graph.categories))
        .enter().append('g')
        .attr('class', 'category');

    graph.legendConfig = {
        rectWidth   : 12,
        rectHeight  : 12,
        xOffset     : -10,
        yOffset     : 30,
        xOffsetText : 20,
        yOffsetText : 10,
        lineHeight  : 15
    };
    graph.legendConfig.xOffsetText += graph.legendConfig.xOffset;
    graph.legendConfig.yOffsetText += graph.legendConfig.yOffset;

    graph.legend.append('rect')
        .attr('x', graph.legendConfig.xOffset)
        .attr('y', function(d, i) {
            return graph.legendConfig.yOffset + i * graph.legendConfig.lineHeight;
        })
        .attr('height', graph.legendConfig.rectHeight)
        .attr('width' , graph.legendConfig.rectWidth)
        .attr('fill'  , function(d) {
            return graph.fillColor(d.key);
        })
        .attr('stroke', function(d) {
            return graph.strokeColor(d.key);
        });

    graph.legend.append('text')
        .attr('x', graph.legendConfig.xOffsetText)
        .attr('y', function(d, i) {
            return graph.legendConfig.yOffsetText + i * graph.legendConfig.lineHeight;
        })
        .text(function(d) {
            return d.typeName + (d.group ? ': ' + d.group : '');
        });

    $('#graph-container').on('scroll', function() {
        graph.legend.attr('transform', 'translate(0,' + $(this).scrollTop() + ')');
    });

    graph.root = graph.svg.append('rect')
        .attr("id", "root")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "none");

    graph.rootG = graph.svg.append('g')
        .attr("id", "rootG");

    function zoomed(event, d) { // adds zoom feature to a chart
        graph.rootG
            .attr('transform', event.transform)
    }

    graph.root
        .call(d3.zoom().scaleExtent([minZoom, maxZoom]).on("zoom", zoomed));

    graph.line = graph.rootG.append('g').selectAll('.link')
        .data(graph.links, function(d) { return d.source.id + "-" + d.target.id; })
        .enter().append('line')
        .attr('class', 'link');

    graph.draggedThreshold = d3.scaleLinear()
        .domain([0, 0.1])
        .range([5, 20])
        .clamp(true);

    function dragged(d) {
        var threshold = graph.draggedThreshold(graph.forceSim.alpha()),
            dx        = d.oldX - d.x,
            dy        = d.oldY - d.y;
        if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
            d.dragged = true;
        }
        return d.dragged;
    }

    graph.drag = d3.drag()
        .subject(function(d) { return { x: event.x, y: event.y }; })// 
        .on('start', function(event, d) {
            d.oldX    = d.x;
            d.oldY    = d.y;
            d.dragged = false;
            d.fixed |= 2;
        })
        .on('drag', function(evemt, d) {
            d.x = event.x;
            d.y = event.y;
            if (dragged(d)) {
                if (!graph.forceSim.alpha()) {
                    graph.forceSim.alpha(.025);
                }
            }
        })
        .on('end', function(event, d) {
            if (!dragged(d)) {
                selectObject(d, this);
            }
            d.fixed &= ~6;
        });

    $('#graph-container').on('click', function(e) {
        if (!$(e.target).closest('.node').length) {
            deselectObject();
        }
    });

    graph.node = graph.rootG.selectAll('.node')
        .data(graph.forceSim.nodes())
        .enter().append('g')
        .attr('class', 'node')
        .call(graph.drag)
        .on('mouseover', function(event, d) {
            if (!selected.obj) {
                if (graph.mouseoutTimeout) {
                    clearTimeout(graph.mouseoutTimeout);
                    graph.mouseoutTimeout = null;
                }
                highlightObject(d);
            }
        })
        .on('mouseout', function() {
            if (!selected.obj) {
                if (graph.mouseoutTimeout) {
                    clearTimeout(graph.mouseoutTimeout);
                    graph.mouseoutTimeout = null;
                }
                graph.mouseoutTimeout = setTimeout(function() {
                    highlightObject(null);
                }, 300);
            }
        })
        .on('dblclick', function(evemt, d) {
            alert(d.name);
        })

    graph.nodeRect = graph.node.append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('stroke', function(d) {
            return graph.strokeColor(d.categoryKey);
        })
        .attr('fill', function(d) {
            return graph.fillColor(d.categoryKey);
        })
        .attr('width' , 120)
        .attr('height', 30);

    graph.node.each(function(d) {
        var node  = d3.select(this),
            rect  = node.select('rect'),
            lines = wrap(d.name),
            ddy   = 1.1,
            dy    = -ddy * lines.length / 2 + .5;

        lines.forEach(function(line) {
            var text = node.append('text')
                .text(line)
                .attr('dy', dy + 'em');
            dy += ddy;
        });
    });

    setTimeout(function() {
        graph.node.each(function(d) {
            var node   = d3.select(this),
                text   = node.selectAll('text'),
                bounds = {},
                first  = true;

            text.each(function() {
                var box = this.getBBox();
                if (first || box.x < bounds.x1) {
                    bounds.x1 = box.x;
                }
                if (first || box.y < bounds.y1) {
                    bounds.y1 = box.y;
                }
                if (first || box.x + box.width > bounds.x2) {
                    bounds.x2 = box.x + box.width;
                }
                if (first || box.y + box.height > bounds.y2) {
                    bounds.y2 = box.y + box.height;
                }
                first = false;
            }).attr('text-anchor', 'middle');

            var padding  = config.graph.labelPadding,
                margin   = config.graph.labelMargin,
                oldWidth = bounds.x2 - bounds.x1;

            bounds.x1 -= oldWidth / 2;
            bounds.x2 -= oldWidth / 2;

            bounds.x1 -= padding.left;
            bounds.y1 -= padding.top;
            bounds.x2 += padding.left + padding.right;
            bounds.y2 += padding.top  + padding.bottom;

            node.select('rect')
                .attr('x', bounds.x1)
                .attr('y', bounds.y1)
                .attr('width' , bounds.x2 - bounds.x1)
                .attr('height', bounds.y2 - bounds.y1);

            d.extent = {
                left   : bounds.x1 - margin.left,
                right  : bounds.x2 + margin.left + margin.right,
                top    : bounds.y1 - margin.top,
                bottom : bounds.y2 + margin.top  + margin.bottom
            };

            d.edge = {
                left   : new geo.LineSegment(bounds.x1, bounds.y1, bounds.x1, bounds.y2),
                right  : new geo.LineSegment(bounds.x2, bounds.y1, bounds.x2, bounds.y2),
                top    : new geo.LineSegment(bounds.x1, bounds.y1, bounds.x2, bounds.y1),
                bottom : new geo.LineSegment(bounds.x1, bounds.y2, bounds.x2, bounds.y2)
            };
        });

        graph.numTicks = 0;
        graph.preventCollisions = true;
        //graph.forceSim.start();
        graph.root.attr("width", graph.svg.node().getBoundingClientRect().width);
        graph.root.attr("height", graph.svg.node().getBoundingClientRect().height);
        for (var i = 0; i < config.graph.ticksWithoutCollisions; i++) {
            graph.forceSim.tick();
        }
        graph.preventCollisions = true;
        $('#graph-container').css('visibility', 'visible');
        preventCollisions();
    });
};

var maxLineChars = 26,
    wrapChars    = ' /_-.'.split('');

function wrap(text) {
    if (text.length <= maxLineChars) {
        return [text];
    } else {
        for (var k = 0; k < wrapChars.length; k++) {
            var c = wrapChars[k];
            for (var i = maxLineChars; i >= 0; i--) {
                if (text.charAt(i) === c) {
                    var line = text.substring(0, i + 1);
                    return [line].concat(wrap(text.substring(i + 1)));
                }
            }
        }
        return [text.substring(0, maxLineChars)]
            .concat(wrap(text.substring(maxLineChars)));
    }
}

function preventCollisions() {
    var quadtree = d3.quadtree().addAll(graph.nodeValues);

    for (var name in graph.data) {
        var obj = graph.data[name],
            ox1 = obj.x + obj.extent.left,
            ox2 = obj.x + obj.extent.right,
            oy1 = obj.y + obj.extent.top,
            oy2 = obj.y + obj.extent.bottom;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && quad.point !== obj) {
                // Check if the rectangles intersect
                var p   = quad.point,
                    px1 = p.x + p.extent.left,
                    px2 = p.x + p.extent.right,
                    py1 = p.y + p.extent.top,
                    py2 = p.y + p.extent.bottom,
                    ix  = (px1 <= ox2 && ox1 <= px2 && py1 <= oy2 && oy1 <= py2);
                if (ix) {
                    var xa1 = ox2 - px1, // shift obj left , p right
                        xa2 = px2 - ox1, // shift obj right, p left
                        ya1 = oy2 - py1, // shift obj up   , p down
                        ya2 = py2 - oy1, // shift obj down , p up
                        adj = Math.min(xa1, xa2, ya1, ya2);

                    if (adj == xa1) {
                        obj.x -= adj / 2;
                        p.x   += adj / 2;
                    } else if (adj == xa2) {
                        obj.x += adj / 2;
                        p.x   -= adj / 2;
                    } else if (adj == ya1) {
                        obj.y -= adj / 2;
                        p.y   += adj / 2;
                    } else if (adj == ya2) {
                        obj.y += adj / 2;
                        p.y   -= adj / 2;
                    }
                }
                return ix;
            }
        });
    }
}

function tick(e) {
    /*
  var alpha = this.alpha();
    var chargeStrength;
if ( alpha > 0.2 ) {
        chargeStrength = (alpha - 0.2 / 0.8);
    }
    else {
        chargeStrength = 0;
    }
    */
    graph.numTicks++;

    for (var name in graph.data) {
        var obj = graph.data[name];

        obj.positionConstraints.forEach(function(c) {
            var w = c.weight * e.alpha;
            if (!isNaN(c.x)) {
                obj.x = (c.x * w + obj.x * (1 - w));
            }
            if (!isNaN(c.y)) {
                obj.y = (c.y * w + obj.y * (1 - w));
            }
        });
    }

    if (graph.preventCollisions) {
        preventCollisions();
    }

    graph.line
        .attr('x1', function(d) {
            return d.source.x;
        })
        .attr('y1', function(d) {
            return d.source.y;
        })
        .each(function(d) {
            if (isIE) {
                // Work around IE bug regarding paths with markers
                // Credit: #6 and http://stackoverflow.com/a/18475039/106302
                this.parentNode.insertBefore(this, this);
            }

            var x    = d.target.x,
                y    = d.target.y,
                line = new geo.LineSegment(d.source.x, d.source.y, x, y);

            for (var e in d.target.edge) {
                var ix = line.intersect(d.target.edge[e].offset(x, y));
                if (ix.in1 && ix.in2) {
                    x = ix.x;
                    y = ix.y;
                    break;
                }
            }

            d3.select(this)
                .attr('x2', x)
                .attr('y2', y);
        });

    graph.node
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });
}

function selectObject(obj, el) {
    var node;
    if (el) {
        node = d3.select(el);
    } else {
        graph.node.each(function(d) {
            if (d === obj) {
                node = d3.select(el = this);
            }
        });
    }
    if (!node) return;

    if (node.classed('selected')) {
        deselectObject();
        return;
    }
    deselectObject(false);

    selected = {
        obj : obj,
        el  : el
    };

    highlightObject(obj);

    node.classed('selected', true);
    $('#docs').html(obj.docs);
    //$('#docs-container').scrollTop(0);
    resize(true);

    var $graph   = $('#graph-container'),
        nodeRect = {
            left   : obj.x + obj.extent.left + graph.margin.left,
            top    : obj.y + obj.extent.top  + graph.margin.top,
            width  : obj.extent.right  - obj.extent.left,
            height : obj.extent.bottom - obj.extent.top
        },
        graphRect = {
            left   : $graph.scrollLeft(),
            top    : $graph.scrollTop(),
            width  : $graph.width(),
            height : $graph.height()
        };
    if (nodeRect.left < graphRect.left ||
        nodeRect.top  < graphRect.top  ||
        nodeRect.left + nodeRect.width  > graphRect.left + graphRect.width ||
        nodeRect.top  + nodeRect.height > graphRect.top  + graphRect.height) {

        $graph.animate({
            scrollLeft : nodeRect.left + nodeRect.width  / 2 - graphRect.width  / 2,
            scrollTop  : nodeRect.top  + nodeRect.height / 2 - graphRect.height / 2
        }, 500);
    }
}

function deselectObject(doResize) {
    if (doResize || typeof doResize == 'undefined') {
        resize(false);
    }
    graph.node.classed('selected', false);
    selected = {};
    highlightObject(null);
}

function highlightObject(obj) {
    if (obj) {
        if (obj !== highlighted) {
            graph.node.classed('inactive', function(d) {
                return (obj !== d
                    && d.depends.indexOf(obj.name) == -1
                    && d.dependedOnBy.indexOf(obj.name) == -1);
            });
            graph.line.classed('inactive', function(d) {
                return (obj !== d.source && obj !== d.target);
            });
        }
        highlighted = obj;
    } else {
        if (highlighted) {
            graph.node.classed('inactive', false);
            graph.line.classed('inactive', false);
        }
        highlighted = null;
    }
}

var showingDocs       = false,
    docsClosePadding  = 8,
    desiredDocsHeight = 300;

function resize(showDocs) {
    var docsHeight  = 0,
        graphHeight = 0,
        // $docs       = $('#docs-container'),
        $graph      = $('#graph-container'),
        $close      = $('#docs-close');

    // if (typeof showDocs == 'boolean') {
    //     showingDocs = showDocs;
    //     $docs[showDocs ? 'show' : 'hide']();
    // }

    // if (showingDocs) {
    //     docsHeight = desiredDocsHeight;
    //     $docs.css('height', docsHeight + 'px');
    // }

    // graphHeight = window.innerHeight - docsHeight;
    $graph.css('height', '400px');

    // $close.css({
    //     top   : graphHeight + docsClosePadding + 'px',
    //     right : window.innerWidth - docsClosePadding + 'px'
    // });
}

d3.select('#fit-button').on('click', function(){
    graph.forceSim.stop();
    zoomFit(0.85, 500);
});

d3.select('#thaw-button').on('click', function(){
    graph.forceSim.restart();
});

d3.select('#svg-button').on('click', function(){
    var html = getSVGString(d3.select('svg').node());
    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, filename + '.svg');
});

d3.select('#png-button').on('click', function(){
    var svgString = getSVGString(d3.select('svg').node());
    svgString2Image( svgString, 2*d3.select('svg').attr("width"), 2*d3.select('svg').attr("height"), 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
        saveAs( dataBlob, filename + '.png' ); // FileSaver.js function
    }
});

function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var nodesToCheck = [ parentElement ], i;

        // Add all the different nodes to check
        var childNodes = parentElement.getElementsByTagName("*");
        for (i = 0; i < childNodes.length; i++) {
            nodesToCheck.push(childNodes[i]);
        }

        // Extract CSS Rules
        var extractedCSSRules = [];
        for (i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch( e ) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            var ruleMatches;
            for (var r = 0; r < cssRules.length; r++) {
                ruleMatches = nodesToCheck.reduce(function (a, b) {
                    return a || b.matches(cssRules[r].selectorText);
                }, false);
                if (ruleMatches)
                    extractedCSSRules.push(cssRules[r].cssText);
            }
        }
        return extractedCSSRules.join(' ');

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

    function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}

function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.clearRect ( 0, 0, width, height );
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });


    };

    image.src = imgsrc;
}

function lapsedZoomFit(ticks, transitionDuration) {
    for (var i = ticks || 200; i > 0; --i) graph.forceSim.tick();
    if (graph.forceSim) graph.forceSim.stop();
    zoomFit(undefined, transitionDuration);
}

function zoomFit(paddingPercent, transitionDuration) {
    var root = d3.select('#rootG');
    var rootG = d3.select('#rootG');
    var bounds = root.node().getBBox();
    var parent = root.node().parentElement.parentElement;
    var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
        fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
    var width = bounds.width,
        height = bounds.height;
    var midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;
    if (width == 0 || height == 0) return; // nothing to fit
    var scale = (paddingPercent || 0.85) / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    var transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);
    root
        .transition()
        .duration(transitionDuration || 0) // milliseconds
        .attr("transform", transform);
}