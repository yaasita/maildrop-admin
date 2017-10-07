var tbl = new Vue({
    el: '#maildrop-list',
    data: {
        filters: [],
        SearchHeader: "",
        SearchRegex: ""
    },
    computed: {
        sortFList: function(){
            var result = [];
            for(var i=0;i<=this.filters.length-1;i++){
                if(this.filters[i].header.match(new RegExp(this.SearchHeader,'i')) != null && this.filters[i].regex.indexOf(this.SearchRegex) > -1){
                    result.push(this.filters[i]);
                }
            }
            return _.orderBy(result, 'time', 'destination')
        }
    },
    methods: {
        Del: function(f){
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    location.reload();
                }
            };
            f.method = "del";
            xmlhttp.open("POST", "./mail.pl");
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(f));
        },
        Add: function(){
            var f ={};
            f.method = "add";
            f.header = this.SearchHeader;
            f.regex = this.SearchRegex;
            f.destination = document.getElementById("addlist").querySelectorAll('select')[0].value;
            if(f.header == "" || f.regex == ""){
                alert("未入力です");
                return;
            }
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    location.reload();
                }
            };
            xmlhttp.open("POST", "./mail.pl");
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(f));
        }
    }
});
function getJSON() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200){
            for(var key in req.response){
                for(var i=0;i<=req.response[key].length-1;i++){
                    var current = req.response[key][i];
                    var list = {};
                    list.time = current.time;
                    list.header = current.header;
                    list.regex = current.regex;
                    list.destination = key;
                    tbl.filters.push(list);
                }
            }
        }
    };
    req.open("GET", "https://example.net/mail/data/filter.json?" + new Date().getTime() , true);
    req.responseType = 'json';
    req.send(null);
}
getJSON();
