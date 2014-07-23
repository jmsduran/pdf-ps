/**
 * pdf-ps.js
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
var PDFPS = {
    /**
     * Used by PDFPS.TextExtract to indicate the parsing scheme for a pdf.
     * 
     * BY_WORD - Delivers text as a streaming sequence of words
     * BY_PAGE - Delivers text by page, each string represent one page's text
     * BY_FILE - Delivers text from the entire pdf file in one string
     */
    TextMode: {
        BY_WORD: 0,
        BY_PAGE: 1,
        BY_FILE: 2
    },
    
    /**
     * Utility which extracts text from pdf documents. Takes the following json
     * map as an argument:
     * 
     *  config:
     *      file - Name of pdf file
     *      mode - Mode which indicates the parsing scheme (see PDFPS.TextMode)
     *      cbstart - Callback signaling the start of text extraction (optional)
     *      cbparse(text) - Callback signaling text (string) received.
     *      cbend - Callback signalling the end of text extraction (optional)
     */
    TextExtract: function(config) {
        var numPages = 0;
        var content = [];
        
        /**
         * Starts the pdf.js document parser.
         */
        var loadPDF = function() {
            PDFJS.disableWorker = true;
            
            // Callback to inform that pdf text extraction has begun.
            if (config.cbstart !== undefined)
                config.cbstart();
            
            PDFJS.getDocument(config.file).then(processPDF);
        };

        /**
         * Promise/callback for handling pages within the pdf document. 
         */
        var processPDF = function(pdf) {
            numPages = pdf.pdfInfo.numPages;

            for (var i = 1; i <= numPages; i++)
                pdf.getPage(i).then(processPage);
        };

        /**
         * Promise/callback for handling the data within a single pdf page.
         */
        var processPage = function(page) {
            page.getTextContent().then(processText);
        };

        /**
         * Promise/callback for handling the text isolated to a single pdf page.
         * Most of the Callback and text processing is done here.
         */
        var processText = function(text) {
            var bidiTexts = text.bidiTexts;
            var lastPage = false;
            var pageText = "";

            for (var i = 0; i < bidiTexts.length; i++) {
                var bidiText = bidiTexts[i];

                // Ignore any whitespace encountered.
                if (!/\S/.test(bidiText.str))
                    continue;
                    
                pageText += bidiText.str;
                
                if (PDFPS.TextMode.BY_WORD === config.mode)
                    config.cbparse(bidiText.str);
            }
            
            content.push(pageText);
            
            if (numPages === content.length)
                lastPage = true;
            
            if (PDFPS.TextMode.BY_PAGE === config.mode)
                config.cbparse(pageText);
            
            // Combine all elements in the content array into one string and
            // pass to the callback.
            if (lastPage && PDFPS.TextMode.BY_FILE === config.mode) {
                var fileText = "";
                
                for (var j = 0; j < content.length; j++)
                    fileText += content[j];
                
                config.cbparse(fileText);
            }
            
            // Callback to inform that pdf text extraction has finished.
            if (config.cbend !== undefined && lastPage)
                config.cbend();
        };

        return {
            /**
             * Main method which starts the text-extraction utility.
             */
            extract: function() {
                loadPDF();
            }
        };
    }
};
