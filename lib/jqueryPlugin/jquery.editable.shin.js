(function($){

    $.fn.enableEdit = function(options)
    {
        return this.each(function(){

            var currentCaretPosition;
            var queque = 0;
            var isHankey = false;
            var workEl = this;

            var spaceKey = 32, enterKey = 13, ctrlKey = 17;

            $(this).attr('contenteditable',true);

            $(this).bind('keydown',function(e){
                $(this).trigger('textInput');
                console.log(e.keyCode);
            });

            $(this).bind('keyup',function(e){


                if(e.keyCode==spaceKey)
                {
                    allEventRefresh(this);
                }
                else if(e.keyCode==ctrlKey)
                {
                    selectRange();
                }
            });

            $(this).bind('focusout',function(e){

                allEventRefresh(this);
                $(this).attr('contenteditable',false);
            });

            $(this).bind('click',function(e){

                $(this).attr('contenteditable',true);
            });


            $(this).bind('click',function(e){
                $(this).attr('contenteditable',true);
            });

            function selectRange(){
                var sel = window.getSelection();

                var startWordNode = sel.anchorNode.parentNode;
                var startWordIdx = $(startWordNode).index();
                var startSentenceNode = startWordNode.parentNode;
                var startSentenceIdx = $(startSentenceNode).index();

                var endWordNode = sel.focusNode.parentNode;
                var endWordIdx = $(endWordNode).index();

                var endSentenceNode = endWordNode.parentNode;
                var endSentenceIdx = $(endSentenceNode).index();

                var editBox = startSentenceNode.parentNode;



                if(startSentenceIdx > endSentenceIdx)
                {
                    startWordNode = sel.focusNode.parentNode;
                    startWordIdx = $(startWordNode).index();
                    startSentenceNode = startWordNode.parentNode;
                    startSentenceIdx = $(startSentenceNode).index();

                    endWordNode = sel.anchorNode.parentNode;
                    endWordIdx = $(endWordNode).index();
                    endSentenceNode = endWordNode.parentNode;
                    endSentenceIdx = $(endSentenceNode).index();


                }
                else if(startSentenceIdx == endSentenceIdx)
                {
                    if(startWordIdx > endWordIdx)
                    {
                        startWordNode = sel.focusNode.parentNode;
                        startWordIdx = $(startWordNode).index();
                        startSentenceNode = startWordNode.parentNode;
                        startSentenceIdx = $(startSentenceNode).index();

                        endWordNode = sel.anchorNode.parentNode;
                        endWordIdx = $(endWordNode).index();
                        endSentenceNode = endWordNode.parentNode;
                        endSentenceIdx = $(endSentenceNode).index();

                    }
                }

                var selectedSentence = [];
                if(startSentenceIdx == endSentenceIdx)
                {

                    var gtVal = startWordIdx;
                    var ltVal = (endWordIdx - gtVal);
                    selectedSentence = $(startSentenceNode).find('.lcWord:gt('+gtVal+'):lt('+ltVal+'), .lcWord:eq('+gtVal+')');
                }
                else
                {

                    var gtVal = startWordIdx;
                    var ltVal = endWordIdx;
                    for(var i = startSentenceIdx ; i <= endSentenceIdx ; i++)
                    {
                        var addSentence=[];

                        if(i==startSentenceIdx)
                        {
                            addSentence = $(editBox).find('.clSentence:eq('+i+')').find('.lcWord:gt('+gtVal+'), .lcWord:eq('+gtVal+')');
                        }
                        else if(i==endSentenceIdx)
                        {
                            addSentence = $(editBox).find('.clSentence:eq('+i+')').find('.lcWord:lt('+ltVal+'), .lcWord:eq('+ltVal+')');
                        }
                        else
                        {
                            addSentence = $(editBox).find('.clSentence:eq('+i+')').find('.lcWord');
                        }
                        console.log(addSentence);
                        selectedSentence.push(addSentence);
                    }

                }



                console.log(selectedSentence);
            }

            function allEventRefresh(el,evt)
            {
                console.log('allEventRefresh');

                var pureTexts = new Array();

                var pureText = $(el).justtext();
                $(el).contents().filter(function(){
                    return this.nodeType === 3;
                }).remove();

                if(pureText.length >0)
                {
                    pureTexts.push(pureText);
                }


                var sentenceDivs =  $(el).find('div').not('.clSentence');
                for(var i = 0 ; i < sentenceDivs.length ; i++)
                {
                    pureTexts.push($(sentenceDivs[i]).justtext());

                    $(sentenceDivs[i]).remove();
                }

                console.log(pureTexts);

                for(idx in pureTexts)
                {
                    var pureText = pureTexts[idx];

                    var newContentWithSpans='';
                    for(var i = 0 ; i < pureText.length ; i++)
                    {
                        if(pureText[i]==' ')
                        {
                            pureText[i] = '&nbsp;'
                        }
                        newContentWithSpans += '<span class=lcWord>'+pureText[i]+'</span>';
                    }
                    if(pureText.length == 0)
                    {
                        newContentWithSpans += '<span class=lcWord><br></span>';
                    }

                    $(el).append("<div class='clSentence'>"+newContentWithSpans+"</div>");

                }



                $(el).find('.lcWord').each(function(idx){
                    var pureText = $(this).text();
                    var textEls = '';

                    if(pureText && (pureText.length>1))
                    {

                        for(var i = 0 ; i < pureText.length ; i++)
                        {
                            textEls +='<span class=lcWord>'+pureText[i]+'</span>';
                        }
                    }


                    if(textEls.length > 1)
                    {

                        $(this).after(textEls);
                        $(this).remove();
                    }

                });

                var caretRow = $(window.getSelection().anchorNode);
                var caretColumn = getCaretPosition(window.getSelection().anchorNode);

                if(!$(caretRow.hasClass('clSentence')) )
                {
                    caretRow = caretRow.parent();
                }
                if(caretRow.hasClass('clSentence'))
                {
                    caretRow = $(el).find('.clSentence').index(caretRow);
                }
                else
                {
                    caretRow = 0;
                }
                console.log("caretRow : " + caretRow);
                console.log("caretColumn : "+caretColumn);


                var caretSentenceEl = $(el).find('.clSentence').eq(caretRow);
                console.log(caretSentenceEl);

                caretColumn = caretColumn>0 ? caretColumn-1 : caretColumn;

                var caretEl = $(caretSentenceEl).find('.lcWord').eq(caretColumn);
                caretEl = caretEl.get()[0];

                var sel = window.getSelection();
                sel.collapse(caretEl,1);

            }

            function setCaretPosition(ctrl, pos)
            {

                if(ctrl.setSelectionRange)
                {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos,pos);
                }
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }
            function getCaretPosition(el)
            {

                var caretPos = 0, containerEl = null, sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount) {
                        range = sel.getRangeAt(0);

                        var container = range.commonAncestorContainer;

                        if(container)
                        {
                            while(container.nodeType!=1)
                            {
                                container =  container.parentNode;
                            }

                            if(container.nodeType==1)
                            {
                                if(container.tagName == 'DIV')
                                {
                                    caretPos = $(container).find('span').length;

                                }
                                else // tagName == 'SPAN'
                                {

                                    while(container.previousElementSibling)
                                    {
                                        container = container.previousElementSibling;

                                        caretPos++;
                                    }

                                    if(caretPos!=0){
                                        caretPos += 1;
                                    }
                                    else if(container.tagName=='SPAN')
                                    {
                                        caretPos=1;
                                    }
                                }
                            }



                        }


                    }


                }
                return caretPos;
            }
        });
    }


    $.fn.justtext = function() {
        return $(this).clone()
            .children()
            .remove()
            .end()
            .text();

    };

}(jQuery));