define([
    "cdf/lib/jquery",
    "cdf/lib/underscore",
    "cdf/lib/mustache", 
    "cdf/AddIn",
    "cdf/Dashboard.Clean",
    "cde/components/NewMapComponent"
    
], function($, _, Mustache, AddIn, Dashboard, Map){
    
    require(["cde/components/Map/model/MapModel"], function(MapModel){
        
    var modes = MapModel.Modes,
        globalStates = {
          "allSelected": "allSelected",
          "someSelected": "someSelected",
          "noneSelected": "noneSelected",
          "disabled": "disabled"
        }, 
        states = MapModel.States, 
        actions = MapModel.Actions, 
        dragStates = "";


    var templateIcon = {
        name: 'templateIcon',
        label: 'templateIcon',
        defaults: {
            template: null,
            formatter: null,
            viewModel: function(st, opt) {
                return $.extend(true, {}, st, opt);   
            },
            width: null,
            height: null
        },
        
        implementation: function(tgt, st, opt) {
            
            var viewModel = opt.viewModel(st, opt);
            
            var template =  _.isFunction(opt.template) ? opt.template(st, opt, viewModel) : opt.template;
            if(!template) {
                return null;
            }
            
            var html = Mustache.render(template, viewModel);
            
            
            var styleMap = {};
            
            _.each(modes, function(mode) {
                _.each(globalStates, function(globalState) {
                    _.each(states, function(state) {
                        _.each(actions, function(action) {
                            
                            styleMap[mode] = styleMap[mode] || {};
                            styleMap[mode][globalState] = styleMap[mode][globalState] || {};
                            styleMap[mode][globalState][state] = styleMap[mode][globalState][state] || {};
                            styleMap[mode][globalState][state][action] = styleMap[mode][globalState][state][action] || {};;
                            styleMap[mode][globalState][state][action] = st.model._getStyle(mode, globalState, state, action, dragStates);
                            
                            var width = _.isFunction(opt.width) ? opt.width(st, opt, viewModel) : opt.width;
                            var height = _.isFunction(opt.height) ? opt.height(st, opt, viewModel): opt.height;

                            styleMap[mode][globalState][state][action]["width"] = width;
                            styleMap[mode][globalState][state][action]["height"] = height;
                            
                            //var formattedHmtl = template;
                            var formattedHmtl;
                            if (_.isFunction(opt.formatter)) {
                                
                                var s = Snap();
                                s.append(Snap.parse(html));
                                var svgObj = s.select("svg");
                                
                                var extendedSt = $.extend({}, st, {mode: mode, globalState: globalState, state: state, action: action, styleMap: styleMap[mode][globalState][state][action]})
                                var _html = opt.formatter(extendedSt, opt, svgObj);
                    
                                formattedHmtl = _html.toString();
                                s.remove();
                            }

//                            styleMap[mode][globalState][state][action]["icon-url"] = "data:text/html;charset=utf-8;base64," + btoa(formattedHmtl || html);
//                            styleMap[mode][globalState][state][action]["icon-url"] = "data:image/svg+xml;base64," + btoa(formattedHmtl || html);
                            styleMap[mode][globalState][state][action]["icon-url"] = "data:image/svg+xml;utf8," + (formattedHmtl || html);
//                            styleMap[mode][globalState][state][action]["icon-url"] = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="220" height="160" viewBox="0 0 1235 650"><rect width="1235" height="650" fill="#FFF"/><path stroke="#B22234" stroke-width="2470" stroke-dasharray="50" d="m0,0v651"/><rect width="494" height="350" fill="#3C3B6E"/><g id="q"><g id="d"><g id="e"><g id="f"><g id="t"><path fill="#FFF" d="M23.3,28.6h37.8l-31,22 12-36 12,36z" id="s"/><use xlink:href="#s" x="82"/></g><use xlink:href="#t" x="164"/><use xlink:href="#s" x="328"/></g><use xlink:href="#s" x="410"/></g><use xlink:href="#f" x="41" y="35"/></g><use xlink:href="#d" y="70"/></g><use xlink:href="#q" y="140"/><use xlink:href="#e" y="280"/></svg>';
//                            styleMap[mode][globalState][state][action]["icon-url"] = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 1235 650"><rect width="1235" height="650" fill="#FFF"/><path stroke="#B22234" stroke-width="2470" stroke-dasharray="50" d="m0,0v651"/><rect width="494" height="350" fill="#3C3B6E"/><path fill="#FFF" d="M23.3,28.6h37.8l-31,22 12-36 12,36z" id="s"/></svg>';
//                            styleMap[mode][globalState][state][action]["icon-url"] = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="220" height="160" viewBox="0 0 1235 650"> <foreignObject width="100%" height="100%"> <div class="icon-container" style="width: 100%;"> <div id="icon" width="80px" height="70px" style="display: block; margin-left: auto; margin-right: auto;display: inline-block; width: 100%;"> <svg version="1" xmlns="http://www.w3.org/2000/svg" width="80px" height="70px" viewBox="0 0 300.000000 287.000000"><path d="M119.5 6.9c-.3 1.2-2.3 3.3-4.3 4.8s-4.5 3.6-5.4 4.7c-.9 1.2-2 1.8-2.3 1.4-1.3-1.3.7-4.8 3.6-6.5l3-1.8-3.3-.7c-3.9-.8-7.8 1.3-7.8 4 0 1.3-2.6 3-9.6 6.2-5.3 2.4-12.1 5.9-15.2 7.8-3.2 1.9-8.3 4.5-11.6 5.8-7.1 2.9-8.5 4.6-8.6 10.5 0 4.4.2 4.7 3.1 5.3 1.7.3 4.9.6 7 .6 5.6 0 5.6 1.6-.1 4.5-2.7 1.4-5 2.8-5 3 0 .3 1.4 1.4 3.1 2.4 3.6 2.2 5.9 1.8 11.5-2 6-4.1 10.8-4.7 15.8-1.9 3.6 1.9 4.6 2.1 8.2 1.1 2.2-.6 5.4-2.4 7-4.1 3.2-3.3 4.4-3.7 4.4-1.6 0 2.4-7.7 8.4-12.2 9.6-4.8 1.3-12.5 8.6-18.2 17.4-8.8 13.5-10.8 16.4-14.3 20.7-2.1 2.6-4.3 5.4-4.8 6.4-1 1.6-1.5 1.5-6.3-2-5-3.6-13.2-13.5-13.2-16 0-2.9-3.5-4.5-8.1-3.7-3.8.6-4.7 1.3-6.6 4.8-1.2 2.2-6.1 8-10.9 13-4.7 4.9-9 9.9-9.4 11.1-.5 1.1-.6 4.5-.3 7.5.4 4.5.2 5.7-1.8 8.2-3 3.8-3.2 13.9-.4 14.4 6.7 1.4 15.5-3.3 15.5-8.3 0-2.2-.4-2.5-3.4-2.5-4.8 0-5.4-1.7-1.1-3.4 1.9-.8 3.5-2.1 3.5-2.9 0-.7 1.1-2.4 2.5-3.7 3-2.8 3.2-5.1.5-7.5-1.1-1-2-2.4-2-3C22 109 33.8 98 35.4 98c3.8 0 10.9 12.1 13 22.1.4 2 1.7 3.1 4.6 4.3 5.6 2.2 6 2.1 5.3-1.9-.6-3.6 1.3-9.8 2.8-9 .4.3.8 1.8.7 3.3-.1 1.5.2 5.4.7 8.6l.8 5.9-5.4-.6c-3-.3-8.2-1.7-11.6-3.1-8-3.3-8.9-3.3-11.4.6-1.6 2.6-1.9 4.2-1.4 7.8.4 2.5 1.4 10.6 2.3 18l1.7 13.5 5.8 3.8c4.9 3.3 5.9 4.6 6.9 8.3.7 2.4 1.7 4.4 2.3 4.4.6 0 2.4 1.3 4 3s3.2 3 3.6 3c1.3 0 4.9-10 4.9-13.7-.1-3.6-2.8-8.9-3.6-6.8-.2.5-1.3 2.5-2.5 4.4-2.6 4.3-4.3 2.9-2.7-2.3 1.1-3.3 1-3.9-.6-4.8-1.3-.7-1.7-2-1.5-5.2.4-5.6-.5-6.6-5.5-6.6h-4.4l-.4-6.8c-.3-3.7-.1-7.2.4-7.9 1.3-1.6 8.9 1.1 15.8 5.7 8.2 5.5 15 8.8 19.7 9.6 3.9.6 4.3.4 6.1-2.6 1.1-1.8 2.3-5.2 2.7-7.6.3-2.4 1.1-4.4 1.7-4.4.7 0 .9 2.7.6 8l-.5 8 9.1 5.4c20.2 12 34.3 16.7 58.1 19.6 11.1 1.4 12.5 2.2 12.5 7.9 0 2 .5 5.3 1.1 7.5.7 2.5.7 4.2.1 4.8-1.2 1.2-3.3-2.4-5.2-8.9-1.4-4.6-1.5-4.7-12.7-5.8-3.5-.4-6.3-.4-6.3-.1 0 2.9 6 12.7 11.4 18.6 7.4 8 8.1 9.8 7.3 17.7-.5 4.4-1.6 7-5.1 12.4-2.5 3.8-6.5 8.6-8.8 10.6-2.3 2.1-6.3 5.9-8.8 8.5-2.6 2.6-5.9 5-7.4 5.4-1.4.3-2.6 1.3-2.6 2.2 0 .9-.7 3.6-1.6 5.9-.9 2.4-1.4 4.6-1 5 .4.4 3.8.7 7.7.6 5.9-.1 7.5-.5 9.5-2.4 3.5-3.3 3.1-5.7-.8-6.1-4.9-.5-4.4-3.2.7-3.6 2.2-.2 4.9-1.2 6-2.2 1.2-1.1 3.9-2.3 6-2.8 4-.8 4-.9 3.8-5.3-.2-3.9.3-5.1 4.2-10.2 2.9-3.6 6.3-6.6 9.4-8.1 7.9-4 8.4-4.9 7.6-12.3l-.7-6.4 3.9 2.5c2.1 1.5 6.7 4.1 10.2 5.9 4.3 2.1 8 5.1 11.4 8.9l5 5.8-2.7 6.3c-4.9 11.6-14.6 24.1-20.8 27-2.5 1.2-4.4 2.5-4.2 2.9.3.4-.4 2.9-1.6 5.5-1.4 3.2-1.7 5-1 5.7.6.6 4.1 1.2 7.8 1.4 6.4.4 7 .2 10-2.6 4.5-4.2 4.2-6.2-.9-6.2-3.3 0-4-.3-3.7-1.7.2-1.3 1.5-1.9 4.3-2.1 2.7-.2 5-1.3 7.6-3.6 2-1.8 5.2-3.6 7.2-4 4.2-.8 4.5-1.7 1.7-5.3-1.1-1.4-2-3.1-2-3.8 0-2.5 5.5-13.1 9.7-18.9 5-6.8 5.9-12.6 2.2-14.8-1.1-.7-4.7-5-8-9.5l-5.8-8.2 4.8-8.4c7-12.1 9.3-18.8 9-26.2-.2-4.9 0-6.1 1.4-6.3.8-.2 2.3.8 3.2 2.1.8 1.3 3.3 3.2 5.5 4.2 2.4 1.1 4.3 2.8 4.9 4.4l.9 2.6.7-3.3c.8-3.3 1.4-3.8 3-2.3 1.4 1.2 8.5 2.4 8.5 1.3 0-.4-1.4-2.7-3.1-5-1.7-2.4-2.9-4.5-2.7-4.7.3-.3 2.6-.1 5.1.4 4.8.9 9.7.4 9.7-.9 0-.4-1.6-1.8-3.5-3.1s-3.5-2.7-3.5-3.2c0-1 3.8-.9 6.1.3 1.3.8 2.5.7 3.9 0 2.6-1.4 2.5-2.8-.3-3.9-2.2-.9-5.4-3.9-4.6-4.4 1.8-1.3 6.5-2.7 8.9-2.7 3.7 0 3.8-1.2.5-3.4-1.8-1.2-5.2-1.7-11.6-1.9l-9-.2 2.6-2.3c1.9-1.6 3.9-2.2 7.3-2.2 2.6-.1 5.8-.7 7.2-1.5 1.4-.8 3.7-1.4 5.3-1.5 1.5 0 3.5-.4 4.5-.9.9-.6 3.1-1.3 4.7-1.6l3-.7-2.4-1.9c-1.3-1-3.4-1.9-4.7-1.9-1.3 0-2.4-.6-2.4-1.3 0-1.8 6.3-3.9 9.4-3.1 1.4.3 2.6.2 2.6-.3 0-1.2-5.4-4.3-7.7-4.3-1.7-.1-6.3-3.2-6.3-4.3 0-.3 1.5-.6 3.3-.7 11.7-.4 14.6-.6 15.1-1.1 1.2-1.1-7.3-5.9-10.5-5.9-3.6 0-13.9-3.1-13.9-4.2 0-1.5 4.5-2 10.9-1.2 8.5 1 11.1.7 13.5-1.6 1.9-1.9 1.9-2.1.3-5.5-2.3-4.8-2.2-5.8.7-5.1 2.9.7 5.6-.2 5.6-1.8-.1-1.3-3.4-5.3-6.9-8.1l-2.5-2 2.2 2.9c3 3.9 2.9 6-.2 5.2-4.3-1.1-5.8.2-5.1 4.4.4 2.3.2 4.1-.4 4.4-.6.4-5.4-.7-10.6-2.3-10-3.2-20.7-4.1-24.6-2.1-1 .6-3.5 3.5-5.4 6.5-1.9 3-3.7 5.5-3.9 5.5-.2 0-.1-1.9.1-4.3.4-3.3 0-4.7-1.6-6.6l-2.1-2.4.6 3c.5 2.6-.1 3.8-4 8.2-4.2 4.8-4.6 5.6-4.6 10.5 0 3.5 1.2 8.8 3.6 15.7 3 8.7 3.5 11.4 3.2 16.8-.5 8.2-3.3 11.1-10.8 11.1-5.1 0-8.7-2.1-18.3-10.7-4.9-4.4-10.3-6.7-20.2-8.9-15.8-3.4-30-9.9-40-18.1-7.7-6.4-8.2-8.6-3-13.2 2-1.7 4.2-3.1 5-3.1 2.5 0 1.7-1.5-1.5-2.7-5.4-2-3.2-3 5.8-2.5 9.7.5 10.3-.8 1.6-3.7-5.5-1.8-7.5-4.7-2.8-3.9 1.6.3 6.3.3 10.4-.1l7.5-.7-3.5-1.5c-1.9-.9-5.1-1.9-7.1-2.3-1.9-.3-4.4-1.3-5.5-2-2.1-1.6-1.9-1.7 4.1-3.2l3-.7-3.2-1c-4.7-1.4-4.4-4.1.3-3.4 1.9.3 4.7.1 6.2-.5s5.1-1 8-.9c9.5.4 3-2.9-8.8-4.4-5.7-.7-8.1-2.1-6.1-3.4.8-.5 2-.7 2.7-.4.7.2 3.9-.3 7.1-1.1 3.2-.9 7.6-1.7 9.8-1.9l4-.3-3-1.3c-1.6-.8-5.5-1.3-8.5-1.2-6.8.1-12.2-2.6-11.3-5.8.3-1.2 1.7-2.4 3.2-2.7 1.4-.4 3.1-1 3.6-1.5.6-.4 3.1-1.1 5.5-1.4 7.3-1.1 7.8-1.5 3.5-3.2-2.4-.8-6.9-1.4-11.1-1.3-5.2 0-7.4-.3-8.4-1.4-1-1.3-.8-1.7 1.5-2.6 1.4-.5 3.1-1 3.7-1 .6 0 .8-.3.4-.7-.4-.4-3-1-5.8-1.3-5.4-.5-8.1-3-3.3-3 1.4 0 4-.8 5.8-1.7 1.8-.9 5-1.9 7.2-2.3l4-.6-5.5-1.9c-3.1-1-8.9-2-13.5-2.1-4.4-.2-8.6-.3-9.2-.4-1.5 0-1.8-2-.3-2 .6 0 2.7-.7 4.8-1.6l3.7-1.5-4-1.5c-2.2-.7-6.2-1.4-9-1.4h-5l2.5-2 2.5-2-6 .2-6 .3-.7 4.4c-.7 4.3-.7 4.5 5.1 10.6 13.8 14.8 17.4 28.4 13.6 51.1-2.1 12.7-5.7 25.4-7.2 25.4-2.4 0-2.6-5-.4-12.8 3-10.9 5.1-21.6 5.1-26.3 0-6.5-3-19-5.7-24.1-2.7-5-10-13.2-14.7-16.5-2.7-1.9-2.8-2.2-1.4-3.6.8-.9 1.8-3.9 2.1-6.8.7-5.6.3-7.4-.8-4zM96 26.1c.9 1.5.8 2.4-.1 3.5-1.6 1.9-3.2 1.8-6.4-.8l-2.7-2.1 2.8-1.3c4.1-1.8 5.2-1.7 6.4.7zM68.3 38.2c1.3 1.9.2 4.8-1.7 4.8-1.4 0-2.9-4.8-1.9-6.3.7-1.1 2.5-.4 3.6 1.5z" class="node" fill="#080808"/><g fill="#A1A1A1"><path d="M89.6 25.4l-2.8 1.3 2.7 2.1c3.2 2.6 4.8 2.7 6.4.8.9-1.1 1-2 .1-3.5-1.2-2.4-2.3-2.5-6.4-.7zM64.7 36.7c-1 1.5.5 6.3 1.9 6.3 1.9 0 3-2.9 1.7-4.8-1.1-1.9-2.9-2.6-3.6-1.5z" class="node"/></g></svg> </div> <div id="text" style="display: inline-block; width: 100%;margin-top:auto;margin-bottom:auto;text-align:center;"> <span><b>Kleyson Rios</b></span> </div> </div> </foreignObject> </svg>';
//                            styleMap[mode][globalState][state][action]["icon-url"] = "data:image/svg+xml;utf8,<svg> <foreignObject width='100%' height='100%'> <div class='icon-container' style='width: 100%;'> <div id='icon' width='80px' height='70px' style='display: block; margin-left: auto; margin-right: auto;display: inline-block; width: 100%;'> <svg version='1' xmlns='http://www.w3.org/2000/svg' width='80px' height='70px' viewBox='0 0 300.000000 287.000000'><path d='M119.5 6.9c-.3 1.2-2.3 3.3-4.3 4.8s-4.5 3.6-5.4 4.7c-.9 1.2-2 1.8-2.3 1.4-1.3-1.3.7-4.8 3.6-6.5l3-1.8-3.3-.7c-3.9-.8-7.8 1.3-7.8 4 0 1.3-2.6 3-9.6 6.2-5.3 2.4-12.1 5.9-15.2 7.8-3.2 1.9-8.3 4.5-11.6 5.8-7.1 2.9-8.5 4.6-8.6 10.5 0 4.4.2 4.7 3.1 5.3 1.7.3 4.9.6 7 .6 5.6 0 5.6 1.6-.1 4.5-2.7 1.4-5 2.8-5 3 0 .3 1.4 1.4 3.1 2.4 3.6 2.2 5.9 1.8 11.5-2 6-4.1 10.8-4.7 15.8-1.9 3.6 1.9 4.6 2.1 8.2 1.1 2.2-.6 5.4-2.4 7-4.1 3.2-3.3 4.4-3.7 4.4-1.6 0 2.4-7.7 8.4-12.2 9.6-4.8 1.3-12.5 8.6-18.2 17.4-8.8 13.5-10.8 16.4-14.3 20.7-2.1 2.6-4.3 5.4-4.8 6.4-1 1.6-1.5 1.5-6.3-2-5-3.6-13.2-13.5-13.2-16 0-2.9-3.5-4.5-8.1-3.7-3.8.6-4.7 1.3-6.6 4.8-1.2 2.2-6.1 8-10.9 13-4.7 4.9-9 9.9-9.4 11.1-.5 1.1-.6 4.5-.3 7.5.4 4.5.2 5.7-1.8 8.2-3 3.8-3.2 13.9-.4 14.4 6.7 1.4 15.5-3.3 15.5-8.3 0-2.2-.4-2.5-3.4-2.5-4.8 0-5.4-1.7-1.1-3.4 1.9-.8 3.5-2.1 3.5-2.9 0-.7 1.1-2.4 2.5-3.7 3-2.8 3.2-5.1.5-7.5-1.1-1-2-2.4-2-3C22 109 33.8 98 35.4 98c3.8 0 10.9 12.1 13 22.1.4 2 1.7 3.1 4.6 4.3 5.6 2.2 6 2.1 5.3-1.9-.6-3.6 1.3-9.8 2.8-9 .4.3.8 1.8.7 3.3-.1 1.5.2 5.4.7 8.6l.8 5.9-5.4-.6c-3-.3-8.2-1.7-11.6-3.1-8-3.3-8.9-3.3-11.4.6-1.6 2.6-1.9 4.2-1.4 7.8.4 2.5 1.4 10.6 2.3 18l1.7 13.5 5.8 3.8c4.9 3.3 5.9 4.6 6.9 8.3.7 2.4 1.7 4.4 2.3 4.4.6 0 2.4 1.3 4 3s3.2 3 3.6 3c1.3 0 4.9-10 4.9-13.7-.1-3.6-2.8-8.9-3.6-6.8-.2.5-1.3 2.5-2.5 4.4-2.6 4.3-4.3 2.9-2.7-2.3 1.1-3.3 1-3.9-.6-4.8-1.3-.7-1.7-2-1.5-5.2.4-5.6-.5-6.6-5.5-6.6h-4.4l-.4-6.8c-.3-3.7-.1-7.2.4-7.9 1.3-1.6 8.9 1.1 15.8 5.7 8.2 5.5 15 8.8 19.7 9.6 3.9.6 4.3.4 6.1-2.6 1.1-1.8 2.3-5.2 2.7-7.6.3-2.4 1.1-4.4 1.7-4.4.7 0 .9 2.7.6 8l-.5 8 9.1 5.4c20.2 12 34.3 16.7 58.1 19.6 11.1 1.4 12.5 2.2 12.5 7.9 0 2 .5 5.3 1.1 7.5.7 2.5.7 4.2.1 4.8-1.2 1.2-3.3-2.4-5.2-8.9-1.4-4.6-1.5-4.7-12.7-5.8-3.5-.4-6.3-.4-6.3-.1 0 2.9 6 12.7 11.4 18.6 7.4 8 8.1 9.8 7.3 17.7-.5 4.4-1.6 7-5.1 12.4-2.5 3.8-6.5 8.6-8.8 10.6-2.3 2.1-6.3 5.9-8.8 8.5-2.6 2.6-5.9 5-7.4 5.4-1.4.3-2.6 1.3-2.6 2.2 0 .9-.7 3.6-1.6 5.9-.9 2.4-1.4 4.6-1 5 .4.4 3.8.7 7.7.6 5.9-.1 7.5-.5 9.5-2.4 3.5-3.3 3.1-5.7-.8-6.1-4.9-.5-4.4-3.2.7-3.6 2.2-.2 4.9-1.2 6-2.2 1.2-1.1 3.9-2.3 6-2.8 4-.8 4-.9 3.8-5.3-.2-3.9.3-5.1 4.2-10.2 2.9-3.6 6.3-6.6 9.4-8.1 7.9-4 8.4-4.9 7.6-12.3l-.7-6.4 3.9 2.5c2.1 1.5 6.7 4.1 10.2 5.9 4.3 2.1 8 5.1 11.4 8.9l5 5.8-2.7 6.3c-4.9 11.6-14.6 24.1-20.8 27-2.5 1.2-4.4 2.5-4.2 2.9.3.4-.4 2.9-1.6 5.5-1.4 3.2-1.7 5-1 5.7.6.6 4.1 1.2 7.8 1.4 6.4.4 7 .2 10-2.6 4.5-4.2 4.2-6.2-.9-6.2-3.3 0-4-.3-3.7-1.7.2-1.3 1.5-1.9 4.3-2.1 2.7-.2 5-1.3 7.6-3.6 2-1.8 5.2-3.6 7.2-4 4.2-.8 4.5-1.7 1.7-5.3-1.1-1.4-2-3.1-2-3.8 0-2.5 5.5-13.1 9.7-18.9 5-6.8 5.9-12.6 2.2-14.8-1.1-.7-4.7-5-8-9.5l-5.8-8.2 4.8-8.4c7-12.1 9.3-18.8 9-26.2-.2-4.9 0-6.1 1.4-6.3.8-.2 2.3.8 3.2 2.1.8 1.3 3.3 3.2 5.5 4.2 2.4 1.1 4.3 2.8 4.9 4.4l.9 2.6.7-3.3c.8-3.3 1.4-3.8 3-2.3 1.4 1.2 8.5 2.4 8.5 1.3 0-.4-1.4-2.7-3.1-5-1.7-2.4-2.9-4.5-2.7-4.7.3-.3 2.6-.1 5.1.4 4.8.9 9.7.4 9.7-.9 0-.4-1.6-1.8-3.5-3.1s-3.5-2.7-3.5-3.2c0-1 3.8-.9 6.1.3 1.3.8 2.5.7 3.9 0 2.6-1.4 2.5-2.8-.3-3.9-2.2-.9-5.4-3.9-4.6-4.4 1.8-1.3 6.5-2.7 8.9-2.7 3.7 0 3.8-1.2.5-3.4-1.8-1.2-5.2-1.7-11.6-1.9l-9-.2 2.6-2.3c1.9-1.6 3.9-2.2 7.3-2.2 2.6-.1 5.8-.7 7.2-1.5 1.4-.8 3.7-1.4 5.3-1.5 1.5 0 3.5-.4 4.5-.9.9-.6 3.1-1.3 4.7-1.6l3-.7-2.4-1.9c-1.3-1-3.4-1.9-4.7-1.9-1.3 0-2.4-.6-2.4-1.3 0-1.8 6.3-3.9 9.4-3.1 1.4.3 2.6.2 2.6-.3 0-1.2-5.4-4.3-7.7-4.3-1.7-.1-6.3-3.2-6.3-4.3 0-.3 1.5-.6 3.3-.7 11.7-.4 14.6-.6 15.1-1.1 1.2-1.1-7.3-5.9-10.5-5.9-3.6 0-13.9-3.1-13.9-4.2 0-1.5 4.5-2 10.9-1.2 8.5 1 11.1.7 13.5-1.6 1.9-1.9 1.9-2.1.3-5.5-2.3-4.8-2.2-5.8.7-5.1 2.9.7 5.6-.2 5.6-1.8-.1-1.3-3.4-5.3-6.9-8.1l-2.5-2 2.2 2.9c3 3.9 2.9 6-.2 5.2-4.3-1.1-5.8.2-5.1 4.4.4 2.3.2 4.1-.4 4.4-.6.4-5.4-.7-10.6-2.3-10-3.2-20.7-4.1-24.6-2.1-1 .6-3.5 3.5-5.4 6.5-1.9 3-3.7 5.5-3.9 5.5-.2 0-.1-1.9.1-4.3.4-3.3 0-4.7-1.6-6.6l-2.1-2.4.6 3c.5 2.6-.1 3.8-4 8.2-4.2 4.8-4.6 5.6-4.6 10.5 0 3.5 1.2 8.8 3.6 15.7 3 8.7 3.5 11.4 3.2 16.8-.5 8.2-3.3 11.1-10.8 11.1-5.1 0-8.7-2.1-18.3-10.7-4.9-4.4-10.3-6.7-20.2-8.9-15.8-3.4-30-9.9-40-18.1-7.7-6.4-8.2-8.6-3-13.2 2-1.7 4.2-3.1 5-3.1 2.5 0 1.7-1.5-1.5-2.7-5.4-2-3.2-3 5.8-2.5 9.7.5 10.3-.8 1.6-3.7-5.5-1.8-7.5-4.7-2.8-3.9 1.6.3 6.3.3 10.4-.1l7.5-.7-3.5-1.5c-1.9-.9-5.1-1.9-7.1-2.3-1.9-.3-4.4-1.3-5.5-2-2.1-1.6-1.9-1.7 4.1-3.2l3-.7-3.2-1c-4.7-1.4-4.4-4.1.3-3.4 1.9.3 4.7.1 6.2-.5s5.1-1 8-.9c9.5.4 3-2.9-8.8-4.4-5.7-.7-8.1-2.1-6.1-3.4.8-.5 2-.7 2.7-.4.7.2 3.9-.3 7.1-1.1 3.2-.9 7.6-1.7 9.8-1.9l4-.3-3-1.3c-1.6-.8-5.5-1.3-8.5-1.2-6.8.1-12.2-2.6-11.3-5.8.3-1.2 1.7-2.4 3.2-2.7 1.4-.4 3.1-1 3.6-1.5.6-.4 3.1-1.1 5.5-1.4 7.3-1.1 7.8-1.5 3.5-3.2-2.4-.8-6.9-1.4-11.1-1.3-5.2 0-7.4-.3-8.4-1.4-1-1.3-.8-1.7 1.5-2.6 1.4-.5 3.1-1 3.7-1 .6 0 .8-.3.4-.7-.4-.4-3-1-5.8-1.3-5.4-.5-8.1-3-3.3-3 1.4 0 4-.8 5.8-1.7 1.8-.9 5-1.9 7.2-2.3l4-.6-5.5-1.9c-3.1-1-8.9-2-13.5-2.1-4.4-.2-8.6-.3-9.2-.4-1.5 0-1.8-2-.3-2 .6 0 2.7-.7 4.8-1.6l3.7-1.5-4-1.5c-2.2-.7-6.2-1.4-9-1.4h-5l2.5-2 2.5-2-6 .2-6 .3-.7 4.4c-.7 4.3-.7 4.5 5.1 10.6 13.8 14.8 17.4 28.4 13.6 51.1-2.1 12.7-5.7 25.4-7.2 25.4-2.4 0-2.6-5-.4-12.8 3-10.9 5.1-21.6 5.1-26.3 0-6.5-3-19-5.7-24.1-2.7-5-10-13.2-14.7-16.5-2.7-1.9-2.8-2.2-1.4-3.6.8-.9 1.8-3.9 2.1-6.8.7-5.6.3-7.4-.8-4zM96 26.1c.9 1.5.8 2.4-.1 3.5-1.6 1.9-3.2 1.8-6.4-.8l-2.7-2.1 2.8-1.3c4.1-1.8 5.2-1.7 6.4.7zM68.3 38.2c1.3 1.9.2 4.8-1.7 4.8-1.4 0-2.9-4.8-1.9-6.3.7-1.1 2.5-.4 3.6 1.5z' class='node' fill='#080808'/><g fill='#A1A1A1'><path d='M89.6 25.4l-2.8 1.3 2.7 2.1c3.2 2.6 4.8 2.7 6.4.8.9-1.1 1-2 .1-3.5-1.2-2.4-2.3-2.5-6.4-.7zM64.7 36.7c-1 1.5.5 6.3 1.9 6.3 1.9 0 3-2.9 1.7-4.8-1.1-1.9-2.9-2.6-3.6-1.5z' class='node'/></g></svg> </div> <div id='text' style='display: inline-block; width: 100%;margin-top:auto;margin-bottom:auto;text-align:center;'> <span><b>Kleyson Rios</b></span> </div> </div> </foreignObject> </svg>";

                        });
                    });
                });
            });
            
            return styleMap;
        },
        
        renderIcon: function(st) {
            var styleMap = {};
            
            _.each(modes, function(mode) {
                _.each(globalStates, function(globalState) {
                    _.each(states, function(state) {
                        _.each(actions, function(action) {
                            
                            styleMap[mode] = styleMap[mode] || {};
                            styleMap[mode][globalState] = styleMap[mode][globalState] || {};
                            styleMap[mode][globalState][state] = styleMap[mode][globalState][state] || {};
                            styleMap[mode][globalState][state][action] = styleMap[mode][globalState][state][action] || {};;
                            styleMap[mode][globalState][state][action] = st.model._getStyle(mode, globalState, state, action, dragStates);
                            
                        });
                    });
                });
            });
            return styleMap;
        }
                
    };
    
    
    var preInit = function() {
        Map.implement({
            _processMarkerImages: function() {
                var markersRoot = this.model.findWhere({id: "markers"});
                if (!markersRoot) {
                  return;
                }
        
                var state = {
                  height: this.configuration.addIns.MarkerImage.options.height,
                  width: this.configuration.addIns.MarkerImage.options.width,
                  url: this.configuration.addIns.MarkerImage.options.iconUrl
                };
        
                markersRoot.leafs()
                  .each(_.bind(processRow, this))
                  .value();
        
                function processRow(m) {
                  var mapping = this.mapping || {};
                  var row = m.get("rawData") || [];
        
                  var st = $.extend(true, {}, state, {
                    data: row,
                    position: m.get("rowIdx"),
                    height: row[mapping.markerHeight],
                    width: row[mapping.markerWidth],
                    model: m
                  });
        
                  // Select addIn, consider all legacy special cases
                  var addinName = this.configuration.addIns.MarkerImage.name,
                    extraSt = {},
                    extraOpts = {};
                  if (addinName === "cggMarker") {
                    extraSt = {
                      cggGraphName: this.configuration.addIns.MarkerImage.options.cggScript,
                      parameters: _.object(_.map(this.configuration.addIns.MarkerImage.options.parameters, function(parameter) {
                        return [parameter[0], row[mapping[parameter[1]]]];
                      }))
                    };
                  }
        
                  // Invoke addIn
                  var addIn = this.getAddIn("MarkerImage", addinName);
                  if (!addIn) {
                    return;
                  }
                  $.extend(true, st, extraSt);
                  var opts = $.extend(true, {}, this.getAddInOptions("MarkerImage", addIn.getName()), extraOpts);
                  var markerIcon = addIn.call(this.placeholder(), st, opts);
        
                  // Update model's style
                  if (_.isObject(markerIcon)) {
                    $.extend(true, m.attributes.styleMap, markerIcon);
                  } else {
                    $.extend(true, m.attributes.styleMap, {
                      width: st.width,
                      height: st.height,
                      "icon-url": markerIcon
                    });
                  }
                }
            }
        });
    }
    
    preInit();

    Dashboard.registerGlobalAddIn("NewMapComponent", "MarkerImage", new AddIn(templateIcon));

    });
}); 