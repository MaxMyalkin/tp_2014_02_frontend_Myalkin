define([
], function(
){
    function getID(){
        var curID = getJSON("id");
        if (curID === null){
            setJSON("id", 0);
            return 0;
        }else{
            setJSON("id", Number(curID) + 1);
            return Number(curID) + 1;
        }
    }

    function setJSON(key, value) {
        localStorage[key] = JSON.stringify(value);
    }

    function getJSON(key) {
        var value = localStorage[key];
        return value ? JSON.parse(value) : null;
    }

    function update(){
        var scores = getJSON('scores');
        if (scores != null){
            for (var i = scores.length - 1; i >= 0; i--)
            {
                $.ajax({
                    url : '/scores',
                    type: 'post',
                    dataType: 'JSON',
                    data: scores[i],
                    success: function(response)
                    {
                        scores.splice(i, 1);
                        setJSON("scores", scores);
                    }
                })
            }

        }
        
    }

    return {
        getID: getID,
        setJSON: setJSON,
        getJSON: getJSON,
        update: update
    }

});