(this.webpackJsonpquantik=this.webpackJsonpquantik||[]).push([[0],{26:function(e,t,n){e.exports=n(92)},31:function(e,t,n){},32:function(e,t,n){},74:function(e,t,n){},90:function(e,t,n){},91:function(e,t,n){},92:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(21),o=n.n(i),c=(n(31),n(32),n(9)),l=n(8),s=n(22),u=n(24),h=n(23),v=n(25),d=n(2),f=n.n(d);n(74);var p=function(e){var t=e.type,n=e.color,a=e.allowed,i=e.onPieceClick;return r.a.createElement("div",{className:"Piece Piece--".concat(a?"allowed":"notAllowed"," Piece--").concat(n," Piece--").concat(t),onClick:i})},m=n(1),y=n.n(m),w=function e(t){Object(l.a)(this,e),this.color=t,this.pieces=["square","square","triangle","triangle","circle","circle","cross","cross"]},b=function(e,t,n,a,r){var i,o,c=C(t,n);for(i=0;i<=3;i++)for(o=0;o<=3;o++){if(e[t][o]&&e[t][o].piece===a&&e[t][o].color!==r)return!1;if(e[i][n]&&e[i][n].piece===a&&e[i][n].color!==r)return!1;if(e[i][o]&&C(i,o)===c&&e[i][o].piece===a&&e[i][o].color!==r)return!1}return!0},C=function(e,t){return e<=1?t<=1?0:2:t<=1?1:3},g=function(e){var t,n,a=[[],[],[],[]],r=[[],[],[],[]],i=[[],[],[],[]],o=["square","triangle","circle","cross"];for(t=0;t<=3;t++)for(n=0;n<=3;n++){var c=e[t][n].piece;a[t].push(c),r[n].push(c),i[C(t,n)].push(c)}for(var l=0;l<=3;l++){if(4===y()(a[l],o).length)return!0;if(4===y()(r[l],o).length)return!0;if(4===y()(i[l],o).length)return!0}return!1},k=function(e){return[e[0].slice(),e[1].slice(),e[2].slice(),e[3].slice()]},E=function(e){var t=new w(e.color);return t.pieces=e.pieces.slice(),t},I=function(e,t,n,a,r){e[a][r]={piece:n,color:t.color},function(e,t){e.pieces.splice(e.pieces.findIndex((function(e){return e===t})),1)}(t,n)};window.doMove=I,window.players=[new w("white"),new w("black")];n(90);var A=function(e){var t=e.x,n=e.y,a=e.board,i=e.onCellClick,o=e.chosen,c=t===o.x&&n===o.y;return r.a.createElement("div",{className:"Cell CellX--".concat(t," CellY--").concat(n," CellZone--").concat(C(t,n)," Cell--").concat(c?"chosen":"notChosen"),onClick:i},a&&a[t][n]&&r.a.createElement(p,{type:a[t][n].piece,color:a[t][n].color}))},x=function(e,t,n){for(var a=[],r=t[n?1:0],i=f()(r.pieces),o=0;o<=3;o++)for(var c=0;c<=3;c++)if(!e[o][c])for(var l=0;l<i.length;l++){var s=i[l];if(b(e,o,c,s,r.color)){var u=[E(t[0]),E(t[1])],h=k(e),v=u[n?1:0];I(h,v,s,o,c),a.push({board:h,players:u,x:o,y:c,piece:s,color:v.color})}}return a},S=function(e,t,n){var a,r=!1,i=x(e.board,e.players,!0),o=[[{},{},{},{}],[{},{},{},{}],[{},{},{},{}],[{},{},{},{}]];8===e.players[1].pieces.length&&(t=0),7===e.players[1].pieces.length&&t>0&&(t-=1);for(var c=0;c<i.length;c++){var l=i[c],s=O(l.board,t,l.players,!0);o[l.x][l.y][l.piece]=s,(!1===r||s>r||s===r&&Math.random()<.1)&&(r=s,a=l)}return I(e.board,e.players[1],a.piece,a.x,a.y),n?(console.log("playv2 best situation",a.x,a.y,a.piece,r),o):e},P=function(e,t){for(var n,a=!1,r=0;r<e.length;r++){var i=e[r],o=O(i.board,t,i.players,!0);if((!1===a||o>a||o===a&&Math.random()<.1)&&(a=o,n=i),a>=992)break}return{best:a,bestSituation:n}},N=function(e,t){for(var n,a=!1,r=0;r<e.length;r++){var i=e[r],o=O(i.board,t,i.players,!1);if((!1===a||o<a||o===a&&Math.random()<.1)&&(a=o,n=i),a<=-992)break}return{best:a,bestSituation:n}},O=function(e,t,n,a){if(0===t||g(e))return j(e,n,a);var r=x(e,n,!a);if(a){var i=N(r,t-1),o=i.best;i.bestSituation;return o}var c=P(r,t-1),l=c.best;c.bestSituation;return l},j=function(e,t,n){var a=g(e);t[n?1:0];return a?n?1e3-t[1].pieces.length:-1e3+t[0].pieces.length:100};window.board=[[!1,!1,!1,{piece:"square",color:"white"}],[!1,!1,!1,!1],[{piece:"triangle",color:"white"},{piece:"circle",color:"black"},!1,!1],[!1,!1,!1,!1]],window.evaluate=j,window.playv2=S,window.getAvailableSituations=x,window.minmaxv2=O,window.maxMinmaxv2=P,window.minMinmaxv2=N;n(91);var M=4,q=function(){return{board:[[!1,!1,!1,!1],[!1,!1,!1,!1],[!1,!1,!1,!1],[!1,!1,!1,!1]],players:[new w("white"),new w("black")],turn:0,chosen:!1,iaComputing:!1,needRestart:!1}},R=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).state=Object(c.a)({},q(),{withIA:!0,iaLevel:M}),n}return Object(v.a)(t,e),Object(s.a)(t,[{key:"onCellClick",value:function(e,t){this.state.board[e][t]||this.state.needRestart||this.setState({chosen:{x:e,y:t}})}},{key:"onPieceClick",value:function(e,t){var n=this,a=this.state,r=a.chosen,i=a.turn,o=a.players,c=a.board,l=r.x,s=r.y,u=o[i%2];if(I(c,u,e,l,s),g(c))return alert("Congrats player ".concat(u.color,"!")),void this.setState({needRestart:!0,chosen:!1});this.setState({board:c,turn:i+1,chosen:!1},(function(){n.state.withIA&&(n.setState({iaComputing:!0}),setTimeout((function(){return n.IAPlay()}),300))}))}},{key:"IAPlay",value:function(){var e=this,t=new Date,n=S(this.state,this.state.iaLevel),a=new Date;console.log("IA took ".concat(a-t,"ms to play")),this.setState(Object(c.a)({},n,{turn:this.state.turn+1,iaComputing:!1}),(function(){g(e.state.board)&&(alert("Congrats IA!"),e.setState({needRestart:!0,chosen:!1}))}))}},{key:"renderGrid",value:function(e){for(var t=this,n=[],a=function(a){for(var i=function(i){n.push(r.a.createElement(A,{chosen:t.state.chosen,key:"".concat(a,":").concat(i),x:a,y:i,board:e,onCellClick:function(){return t.onCellClick(a,i)}}))},o=0;o<=3;o++)i(o)},i=0;i<=3;i++)a(i);return n}},{key:"render",value:function(){var e=this,t=this.state,n=t.board,a=t.players,i=t.turn,o=t.chosen,c=o.x,l=o.y,s=a[i%2];return r.a.createElement("div",{className:"Game"},r.a.createElement("div",{className:"Board"},this.renderGrid(n)),r.a.createElement("div",{className:"Controls"},r.a.createElement("div",{className:"HumanOrIa"},"Player vs. Player",r.a.createElement("input",{type:"radio",name:"player2",value:"IA",checked:!this.state.withIA,onChange:function(){return e.setState({withIA:!1})}}),"Player vs. IA",r.a.createElement("input",{type:"radio",name:"player2",value:"human",checked:this.state.withIA,onChange:function(){return e.setState({withIA:!0})}})),this.state.withIA&&r.a.createElement("div",{className:"IALevel"},r.a.createElement("label",{htmlFor:"ia_level"},"IA Difficulty"),r.a.createElement("select",{id:"ia_level",name:"ia_level",value:this.state.iaLevel,onChange:function(t){return e.setState({iaLevel:parseInt(t.target.value,10)})}},r.a.createElement("option",{value:2},"Easy"),r.a.createElement("option",{value:M},"Medium"),r.a.createElement("option",{value:5},"Hard"))),!this.state.needRestart&&r.a.createElement("div",null,"Player ",s.color," turn"),this.state.needRestart&&r.a.createElement("button",{onClick:function(){e.setState(q())}},"New game!"),r.a.createElement("div",null,"--"),this.state.iaComputing&&r.a.createElement("div",null,"IA is computing.."),r.a.createElement("div",{className:"Choice"},o&&r.a.createElement("div",null,r.a.createElement("div",null,"Choose"),r.a.createElement("div",{onClick:function(){return e.setState({chosen:!1})}},"X"),r.a.createElement("div",null,f()(s.pieces).map((function(t,a){return!!b(n,c,l,t,s.color)&&r.a.createElement(p,{key:a,color:s.color,type:t,allowed:!0,onPieceClick:function(){return e.onPieceClick(t,a)}})})))))))}}]),t}(r.a.Component);var L=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(R,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(L,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[26,1,2]]]);
//# sourceMappingURL=main.0cc35175.chunk.js.map