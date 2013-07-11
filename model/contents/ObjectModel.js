define(['jquery','underscore','backbone'],
    function($,_,Backbone){

    var ObjectModel = Backbone.Model.extend({
        defaults:{
            type :'object',
            width : '100%',
            height : '100%',
            background : null,
            translateX : 0,
            translateY : 0,
            translateZ : 0,
            rotateX : 0,
            rotateY : 0,
            rotateZ : 0,
            scaleX : 1,
            scaleY : 1,
            scaleZ : 1,
            matrix3d : null,

            //style
            borderWidth : 0

        },

        doCommited : true,
        commitBeforeData : {},
        controller : null,

        initialize : function()
        {
            _.bindAll(this);
            if( !this.get('boxShadows') ){
                this.set({boxShadows: new Array()});
            }
        },



        set : function(key,value)
        {
            Backbone.Model.prototype.set.apply(this,arguments);

            if(this.doCommited)
            {
                this.commitBeforeData = this.copyObject(this.attributes);
                this.doCommited = false;

            }
        },

        isSelected : function()
        {
            return this.selected;
        },

        commitToCollection : function(key,value)
        {

            var prevValue = this.commitBeforeData[key];

            if(typeof(key)!='string')
            {
                prevValue = this.commitBeforeData[key[0]];
            }

            if(typeof(value)=='object')
            {
                if(prevValue)
                {
                    prevValue =  prevValue.slice(0);
                }
                else
                {
                    prevValue = new Array();
                }
            }

            var historyData = {
                    'model' : this,
                    'type' : 'obj',           //add, remove, obj
                    'key' : key,
                    'value' : value,
                    'prevValue' : prevValue
                };


            var isChanged = false;

            if(typeof(value)=='object')
            {

                if(value.length == prevValue.length)
                {
                    for(var i = 0 ; i < value.length ; i++)
                    {

                        if(value[i] != prevValue[i])
                        {
                            isChanged = true;
                            break;
                        }
                    }
                }
                else
                {
                    isChanged = true;
                }
            }
            else if(historyData.value != historyData.prevValue)
            {
                isChanged = true;
            }

            if(isChanged)
            {


                this.doCommited = true;
                this.commitBeforeData = 0;

                if(typeof(key)=='string')
                {
                    this.set(key,value);
                }
                else
                {
                    var setData = {};

                    for(var i = 0;  i < key.length ; i++)
                    {
                        setData[key[i]] = value;
                    }


                    this.set(setData);
                }

                              console.log(historyData);
                this.collection.addToHistory(historyData);
            }
        },

        setSelected : function() {
            this.selected = true;
            this.collection.setSelected(this);
        },

        setSelected : function() {
            this.selected = true;
            this.collection.setSelected(this);
        },

        copyObject : function(obj) {
            var newObj = {};
            for (var key in obj) {
                //copy all the fields
                if( Object.prototype.toString.call( obj[key] ) === '[object Array]' ) {
                    newObj[key] = obj[key].slice(0);
                }
                else
                {
                    newObj[key] = obj[key];
                }

            }

            return newObj;
        }

    });

    return ObjectModel;
});