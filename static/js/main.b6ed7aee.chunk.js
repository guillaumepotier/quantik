(this.webpackJsonpquantik=this.webpackJsonpquantik||[]).push([[0],{26:function(e,t,a){e.exports=a(92)},31:function(e,t,a){},32:function(e,t,a){},74:function(e,t,a){},90:function(e,t,a){},91:function(e,t,a){},92:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(22),o=a.n(i),l=(a(31),a(32),a(10)),c=a(2),s=a(8),u=a(24),h=a(23),v=a(25),f=a(9),m=a.n(f);a(74);var p=function(e){var t=e.type,a=e.color,n=e.allowed,i=e.onPieceClick;return r.a.createElement("div",{className:"Piece Piece--".concat(n?"allowed":"notAllowed"," Piece--").concat(a," Piece--").concat(t),onClick:i})},d=a(1),y=a.n(d),w=function e(t){Object(c.a)(this,e),this.color=t,this.pieces=["square","square","triangle","triangle","circle","circle","cross","cross"],this.lastPlay=!1},g=function(e,t,a,n,r){var i,o,l=b(t,a);for(i=0;i<=3;i++)for(o=0;o<=3;o++){if(e[t][o]&&e[t][o].piece===n&&e[t][o].color!==r)return!1;if(e[i][a]&&e[i][a].piece===n&&e[i][a].color!==r)return!1;if(e[i][o]&&b(i,o)===l&&e[i][o].piece===n&&e[i][o].color!==r)return!1}return!0},b=function(e,t){return e<=1?t<=1?0:2:t<=1?1:3},k=function(e,t){var a,n,r=[[],[],[],[]],i=[[],[],[],[]],o=[[],[],[],[]],l=["square","triangle","circle","cross"];for(a=0;a<=3;a++)for(n=0;n<=3;n++){var c=e[a][n].piece;e[a][n]&&(r[a].push(c),i[n].push(c),o[b(a,n)].push(c))}for(var s=0;s<=3;s++)if(4===r[s].length||4===i[s].length||4===o[s].length){if(4===y()(r[s],l).length)return!t||{what:"row",where:s};if(4===y()(i[s],l).length)return!t||{what:"col",where:s};if(4===y()(o[s],l).length)return!t||{what:"zone",where:s}}return!1},C=function(e){for(var t={0:!0,1:!0,2:!0,3:!0},a={0:!0,1:!0,2:!0,3:!0},n=0;n<=3;n++)for(var r=0;r<=3;r++)e[n][r]&&(a[r]=!1,t[n]=!1);return{rows:t,cols:a}},E=function(e){var t=new w(e.color);return t.pieces=e.pieces.slice(),t},x=function(e,t,a,n,r){e[n][r]={piece:a,color:t.color},function(e,t){e.pieces.splice(e.pieces.findIndex((function(e){return e===t})),1)}(t,a),t.lastPlay={piece:a,x:n,y:r}},A=function(e,t,a,n,r){e[n][r]=!1,t.pieces.push(a),t.lastPlay=!1},I=function(e){if(e<=1e3)return e;if(e<=1e6)return"".concat(Math.floor(e/1e3),"k+");var t=Math.floor(e/1e6),a=Math.floor((e-1e6*t)/1e5);return"".concat(t,",").concat(a,"M+")},S=function(e){if(e<=1e3)return"".concat(e,"ms");var t=Math.floor(e/1e3),a=Math.floor((e-1e3*t)/100);return"".concat(t,",").concat(a,"s")},P=function(e,t){var a=JSON.parse(window.localStorage.getItem("quantik:results"))||[];a.push({w:e,d:t,t:(new Date).getTime()}),window.localStorage.setItem("quantik:results",JSON.stringify(a))};window.doMove=x,window.players=[new w("white"),new w("black")];a(90);var M=function(e){var t=e.x,a=e.y,n=e.board,i=e.onCellClick,o=e.chosen,l=e.won,c=t===o.x&&a===o.y,s=b(t,a),u=!1;return l&&("row"===l.what&&l.where===t||"col"===l.what&&l.where===a||"zone"===l.what&&l.where===s)&&(u=!0),r.a.createElement("div",{className:"Cell CellX--".concat(t," CellY--").concat(a," CellZone--").concat(s," Cell--").concat(c?"chosen":"notChosen"," Cell--").concat(u?"winning":"notWinning"),onClick:i},n&&n[t][a]&&r.a.createElement(p,{type:n[t][a].piece,color:n[t][a].color}))};window.evaluatedMoves=0;var N=function(){function e(){Object(c.a)(this,e)}return Object(s.a)(e,[{key:"getAvailableSituations",value:function(e,t,a,n){for(var r=[],i=t[a?1:0],o=m()(i.pieces),l=0;l<=3;l++)for(var c=0;c<=3;c++)if(!e[l][c]){if(n){var s=C(e),u=s.rows,h=s.cols;if(!u[l]||!h[c])continue}for(var v=0;v<o.length;v++){var f=o[v];g(e,l,c,f,i.color)&&r.push({x:l,y:c,piece:f})}}return r}},{key:"play",value:function(e,t,a){this.evaluatedMoves=0;var n=!1,r=!1,i=this.getAvailableSituations(e.board,e.players,!0),o=[E(e.players[0]),E(e.players[1])];if(a)var l=[[{},{},{},{}],[{},{},{},{}],[{},{},{},{}],[{},{},{},{}]];8===e.players[1].pieces.length&&(t=0),7===e.players[1].pieces.length&&(t=Math.max(0,t-1),i=this.getAvailableSituations(e.board,e.players,!0,!0));for(var c=0;c<i.length;c++){var s=i[c];x(e.board,o[1],s.piece,s.x,s.y);var u=this.minmax(e.board,t,o,!0);A(e.board,o[1],s.piece,s.x,s.y),a&&(l[s.x][s.y][s.piece]=u),(!1===n||u>n||u===n&&Math.random()<.1)&&(n=u,r=s)}return!1!==r&&(x(e.board,e.players[1],r.piece,r.x,r.y),a?(console.log("playv2 best situation",r.x,r.y,r.piece,n),l):e)}},{key:"max",value:function(e,t,a,n){for(var r,i=!1,o=0;o<e.length;o++){var l=e[o];x(a,n[1],l.piece,l.x,l.y);var c=this.minmax(a,t,n,!0);if(A(a,n[1],l.piece,l.x,l.y),(!1===i||c>i||c===i&&Math.random()<.1)&&(i=c,r=l),i>=992)break}return{best:i,bestSituation:r}}},{key:"min",value:function(e,t,a,n){for(var r,i=!1,o=0;o<e.length;o++){var l=e[o];x(a,n[0],l.piece,l.x,l.y);var c=this.minmax(a,t,n,!1);if(A(a,n[0],l.piece,l.x,l.y),(!1===i||c<i||c===i&&Math.random()<.1)&&(i=c,r=l),i<=-992)break}return{best:i,bestSituation:r}}},{key:"minmax",value:function(e,t,a,n){var r=k(e);if(0===t||r)return this.evaluate(e,a,n,r);var i=this.getAvailableSituations(e,a,!n);if(n){var o=this.min(i,t-1,e,a),l=o.best;o.bestSituation;return l}var c=this.max(i,t-1,e,a),s=c.best;c.bestSituation;return s}},{key:"evaluate",value:function(e,t,a,n){return this.evaluatedMoves++,(n="undefined"===typeof n?k(e):n)?(a?1:-1)*(1e3-t[a?1:0].pieces.length):100}}]),e}(),O=(a(91),5),j=new N,F=function(){return{board:[[!1,!1,!1,!1],[!1,!1,!1,!1],[!1,!1,!1,!1],[!1,!1,!1,!1]],players:[new w("white"),new w("black")],turn:0,chosen:!1,iaComputing:!1,iaLog:!1,needRestart:!1,won:!1}},L=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(h.a)(t).call(this,e))).state=Object(l.a)({},F(),{withIA:!0,iaFirst:!1,iaLevel:O}),a}return Object(v.a)(t,e),Object(s.a)(t,[{key:"onCellClick",value:function(e,t){this.state.board[e][t]||this.state.needRestart||this.setState({chosen:{x:e,y:t}})}},{key:"onPieceClick",value:function(e,t){var a=this,n=this.state,r=n.chosen,i=n.turn,o=n.players,l=n.board,c=n.withIA,s=n.iaLevel,u=r.x,h=r.y,v=o[i%2];x(l,v,e,u,h);var f=k(l,!0);if(!1!==f)return alert("Congrats player ".concat(v.color,"!")),this.setState({needRestart:!0,chosen:!1,won:f}),void(c&&P("white"===v.color,s));this.setState({board:l,players:o,turn:i+1,chosen:!1},(function(){c&&(a.setState({iaComputing:!0}),setTimeout((function(){return a.IAPlay()}),300))}))}},{key:"onIAFirstChange",value:function(){var e=!this.state.iaFirst;this.setState({iaFirst:e}),e&&0===this.state.turn&&this.iaFirst()}},{key:"iaFirst",value:function(){this.IAPlay(),this.setState({turn:0})}},{key:"IAPlay",value:function(){var e=this,t=this.state.iaLevel,a=new Date,n=j.play(this.state,this.state.iaLevel),r=new Date;if(console.log("IA took ".concat(r-a,"ms to play")),!1===n)return alert("Congrats white! IA has no move left to play, you won!"),this.setState({needRestart:!0,chosen:!1}),void P(!0,t);this.setState(Object(l.a)({},n,{iaLog:"IA evaluated ".concat(I(j.evaluatedMoves)," possible moves in ").concat(S(r-a),"."),turn:this.state.turn+1,iaComputing:!1}),(function(){var a=k(e.state.board,!0);!1!==a&&(alert("Congrats IA, you won! Guillaume is proud of you!"),e.setState({needRestart:!0,chosen:!1,won:a}),P(!1,t))}))}},{key:"undoMove",value:function(){var e=this.state,t=e.board,a=e.players,n=e.turn;A(t,a[1],a[1].lastPlay.piece,a[1].lastPlay.x,a[1].lastPlay.y),A(t,a[0],a[0].lastPlay.piece,a[0].lastPlay.x,a[0].lastPlay.y),this.setState({board:t,players:a,turn:n-2})}},{key:"renderGrid",value:function(e){for(var t=this,a=[],n=this.state,i=n.chosen,o=n.won,l=function(n){for(var l=function(l){a.push(r.a.createElement(M,{chosen:i,won:o,key:"".concat(n,":").concat(l),x:n,y:l,board:e,onCellClick:function(){return t.onCellClick(n,l)}}))},c=0;c<=3;c++)l(c)},c=0;c<=3;c++)l(c);return a}},{key:"render",value:function(){var e=this,t=this.state,a=t.board,n=t.players,i=t.turn,o=t.chosen,c=o.x,s=o.y,u=n[i%2],h=o?m()(u.pieces).filter((function(e){return g(a,c,s,e,u.color)})):[];return r.a.createElement("div",{className:"Game"},r.a.createElement("div",{className:"Parameters"},r.a.createElement("div",{className:"HumanOrIa"},r.a.createElement("span",null,"Player vs."),r.a.createElement("span",null,"Player",r.a.createElement("input",{type:"radio",name:"player2",value:"IA",checked:!this.state.withIA,onChange:function(){return e.setState({withIA:!1})}}),"IA",r.a.createElement("input",{type:"radio",name:"player2",value:"human",checked:this.state.withIA,onChange:function(){return e.setState({withIA:!0})}}))),this.state.withIA&&r.a.createElement("div",{className:"IALevel"},r.a.createElement("label",{htmlFor:"ia_level"},"IA Difficulty"),r.a.createElement("select",{id:"ia_level",name:"ia_level",value:this.state.iaLevel,onChange:function(t){return e.setState({iaLevel:parseInt(t.target.value,10)})}},r.a.createElement("option",{value:3},"Easy"),r.a.createElement("option",{value:O},"Medium"),r.a.createElement("option",{value:6},"Hard")),"IA plays first ",r.a.createElement("input",{type:"checkbox",defaultChecked:this.state.iaFirst,onChange:function(){return e.onIAFirstChange()}})),!this.state.needRestart&&r.a.createElement("div",null,r.a.createElement("span",null,"Player ",u.color," turn"),n[0].lastPlay&&n[1].lastPlay&&r.a.createElement("button",{onClick:function(){return e.undoMove()}},"Undo previous")),this.state.needRestart&&r.a.createElement("button",{onClick:function(){e.setState(Object(l.a)({},e.state,{},F())),e.state.iaFirst&&setTimeout((function(){return e.iaFirst()}),300)}},"New game!")),r.a.createElement("div",{className:"Board"},this.renderGrid(a)),r.a.createElement("div",{className:"Controls"},this.state.iaComputing&&r.a.createElement("small",null,"IA is computing.."),this.state.iaLog&&!this.state.iaComputing&&r.a.createElement("small",null,this.state.iaLog),r.a.createElement("div",{className:"Choice"},o&&r.a.createElement("div",null,r.a.createElement("div",{className:"Choice-title"},"Allowed pieces"),r.a.createElement("div",{className:"Close",onClick:function(){return e.setState({chosen:!1})}},"X"),r.a.createElement("div",{className:"Choice-pieces"},!h.length&&r.a.createElement("span",null,"None! ",r.a.createElement("span",{role:"img","aria-label":"sad"},"\ud83d\ude30")),h.map((function(t,n){return!!g(a,c,s,t,u.color)&&r.a.createElement(p,{key:n,color:u.color,type:t,allowed:!0,onPieceClick:function(){return e.onPieceClick(t,n)}})})))))),r.a.createElement("div",{className:"Version"},"v0.5.0"))}}]),t}(r.a.Component);var q=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(L,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[26,1,2]]]);
//# sourceMappingURL=main.b6ed7aee.chunk.js.map