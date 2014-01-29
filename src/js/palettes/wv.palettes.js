/*
 * NASA Worldview
 *
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project.
 *
 * Copyright (C) 2013 - 2014 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

/**
 * @module wv.palettes
 */
var wv = wv || {};

wv.palettes = (function(self) {

    var checkerboard;

    self.supported = true;

    var init = function() {
        var browser = wv.util.browser;
        if ( browser.ie || !browser.webWorkers || !browser.cors ) {
            self.supported = false;
        } else {
            drawCheckerboard();
        }
    };

    self.colorbar = function(target, palette) {
        var canvas;
        if ( target.length ) {
            canvas = $(target).get(0);
        } else {
            canvas = target;
        }
        var g = canvas.getContext("2d");

        g.fillStyle = checkerboard;
        g.fillRect(0, 0, canvas.width, canvas.height);
        if ( palette ) {
            var colors = palette.colors;
            var bins = colors.length;
            var binWidth = canvas.width / bins;
            var drawWidth = Math.ceil(binWidth);
            _.each(colors, function(color, i) {
                g.fillStyle = "#" + color;
                g.fillRect(Math.floor(binWidth * i), 0, drawWidth,
                        canvas.height);
            });
        }
    };

    var drawCheckerboard = function() {
        var size = 2;
        var canvas = document.createElement("canvas");

        canvas.width = size * 2;
        canvas.height = size * 2;

        var g = canvas.getContext("2d");

        g.fillStyle = "rgb(102, 102, 102)";
        g.fillRect(0, 0, size, size);
        g.fillRect(size, size, size, size);

        g.fillStyle = "rgb(153, 153, 153)";
        g.fillRect(0, size, size, size);
        g.fillRect(size, 0, size, size);

        checkerboard = g.createPattern(canvas, "repeat");
    };

    self.translate = function(sourcePalette, targetPalette) {
        var sourceCount = sourcePalette.colors.length;
        var targetCount = targetPalette.colors.length;

        var newPalette = {
            "id": targetPalette.id,
            "name": targetPalette.name || undefined,
            "values": sourcePalette.values || undefined
        };
        var newColors = [];
        _.each(sourcePalette.colors, function(color, index) {
            var sourcePercent = index / sourceCount;
            var targetIndex = Math.floor(sourcePercent * targetCount);
            newColors.push(targetPalette.colors[targetIndex]);
        });
        newPalette.colors = newColors;
        return newPalette;
    };

    self.lookup = function(sourcePalette, targetPalette) {
        var lookup = {};
        _.each(sourcePalette.colors, function(sourceColor, index) {
            var source =
                parseInt(sourceColor.substring(0, 2), 16) + "," +
                parseInt(sourceColor.substring(2, 4), 16) + "," +
                parseInt(sourceColor.substring(4, 6), 16) + "," +
                "255";
            var targetColor = targetPalette.colors[index];
            var target = {
                r: parseInt(targetColor.substring(0, 2), 16),
                g: parseInt(targetColor.substring(2, 4), 16),
                b: parseInt(targetColor.substring(4, 6), 16),
                a: 255
            };
            lookup[source] = target;
        });
        return lookup;
    };

    init();
    return self;

})(wv.palettes || {});