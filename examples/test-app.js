/**
 * pdf-ps.js; test-app.js
 * A collection of JavaScript utilities for working with pdf documents.
 * Copyright (C) 2014 James M. Duran
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Test App
 *  Sample pdf: test.pdf
 */
var TEST_APP = (function() {
    var byWordConfig = {
        file: "test.pdf",
        mode: PDFPS.TextMode.BY_WORD,
        
        cbstart: function() {
            console.log("=== BY_WORD text extraction has begun ===");
        },
        
        cbparse: function(text) {
            console.log("word received: " + text);
        },
        
        cbend: function() {
            console.log("=== BY_WORD text extraction has finished ===");
        }
    };
    
    var byPageConfig = {
        file: "test.pdf",
        mode: PDFPS.TextMode.BY_PAGE,
        
        cbstart: function() {
            console.log("=== BY_PAGE text extraction has begun ===");
        },
        
        cbparse: function(text) {
            console.log("page received: " + text);
        },
        
        cbend: function() {
            console.log("=== BY_PAGE text extraction has finished ===");
        }
    };
    
    var byFileConfig = {
        file: "test.pdf",
        mode: PDFPS.TextMode.BY_FILE,
        
        cbstart: function() {
            console.log("=== BY_FILE text extraction has begun ===");
        },
        
        cbparse: function(text) {
            console.log("pdf document text received: " + text);
        },
        
        cbend: function() {
            console.log("=== BY_FILE text extraction has finished ===");
        }
    };
    
    return {
        start: function() {
            var byWord = new PDFPS.TextExtract(byWordConfig);
            byWord.extract();
            
            var byPage = new PDFPS.TextExtract(byPageConfig);
            byPage.extract();
            
            var byFile = new PDFPS.TextExtract(byFileConfig);
            byFile.extract();
        }
    };
})().start();