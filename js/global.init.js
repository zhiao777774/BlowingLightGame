const gameMode = ['吹氣計秒數', '吹氣競賽', '蜂鳴器播音'];

(function (global, document) {
    Date.prototype.getFullDate = function (separator) {
        separator = !$.isArray(separator) ?
            new Array(3) : separator;

        for (let i = 0; i < 3; i++) {
            separator[i] = separator[i] || '/';
        }

        return this.getFullYear() + separator[0] +
            (this.getMonth() + 1) + separator[1] +
            (this.getDate());
    };

    Date.prototype.getFullTime = function () {
        let o = {
            h: this.getHours().toString(),
            m: this.getMinutes().toString(),
            s: this.getSeconds().toString(),
        };
        let format = (ele) => (ele.length === 1 ? '0' : '') + ele;

        return format(o.h) + ':' + format(o.m) + ':' + format(o.s);
    };
})(window, document);