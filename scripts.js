Number.prototype.roundToFixed = function (radix) {
    var val = this;
    radix = radix || 0;

    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
};

function Program(name) {
    var StatGroup = function (name) {
        return {
            name: name,
            totalClosed: 0,
            successfulClosed: 0,
            successRate: '-'
        };
    };
    return {
        name: name,
        data: [
            StatGroup('week'),
            StatGroup('month')
        ]
    };
}

function StaticController($scope) {
    var programNames = [
        'Janus',
        'Mobile',
        'Revenue',
        'Video',
        'On Demand',
        'Platform'
    ];
    
    $scope.programs = [];
    _(programNames).each(function (name) {
        $scope.programs.push(Program(name));
    });
    
    $scope.recalculate = function (period) {
        try {
            var total = period.successfulClosed / period.totalClosed * 100;
            if (_(total).isFinite()) {
                return total.roundToFixed();
            } else {
                throw new Error();
            }
        } catch (err) {
            return '-';
        }
    };
    
    $scope.sumTotalClosed = function (period) {
        var sum = 0;
        $(period.class).each(function (i, val) {
            sum += val;
        });
        return sum;
    };
}
