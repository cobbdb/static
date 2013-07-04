Number.prototype.roundToFixed = function (radix) {
    var val = this;
    radix = radix || 0;

    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
};

// Setup the datepickers.
$(function () {
    $('#fromDate').datepicker({
        dateFormat: 'M d'
    });
    $('#toDate').datepicker({
        dateFormat: 'M d, yy'
    });
});

var Period = {
    week: 0,
    month: 1
};

function Program(name) {
    var StatGroup = function (name, period) {
        return {
            name: name,
            id: period,
            totalClosed: 0,
            successfulClosed: 0,
            successRate: '-'
        };
    };
    return {
        name: name,
        data: [
            StatGroup('week', Period.week),
            StatGroup('month', Period.month)
        ]
    };
}

function StaticController($scope) {
    var programNames = [
        'Janus',
        'Mobile',
        'On Demand',
        'Platform',
        'Revenue',
        'Video'
    ];

    $scope.programs = [];
    _(programNames).each(function (name) {
        var entry = Program(name);
        $scope.programs.push(entry);
    });

    $scope.totals = Program('Totals');
}

function FormController($scope) {
    $scope.calculateRow = function (period) {
        try {
            var total = period.successfulClosed / period.totalClosed * 100;
            if (_(total).isFinite()) {
                period.successRate = total.roundToFixed();
            } else {
                throw new Error();
            }
        } catch (err) {
            period.successRate = '-';
        }
        return period.successRate;
    };

    $scope.sumTotalClosed = function (period) {
        var sum = 0;
        _($scope.programs).each(function (program) {
            sum += program.data[period].totalClosed;
        });
        $scope.totals.data[period].totalClosed = sum;
        return sum;
    };

    $scope.sumSuccessfulClosed = function (period) {
        var sum = 0;
        _($scope.programs).each(function (program) {
            sum += program.data[period].successfulClosed;
        });
        $scope.totals.data[period].successfulClosed = sum;
        return sum;
    };
}

function ReportController($scope) {
    var weekTpl = _.template($('#weekTpl').text().trim());
    var monthTpl = _.template($('#monthTpl').text().trim());
    var totalsTpl = _.template($('#totalsTpl').text().trim());
    var summaryTpl = _.template($('#summaryTpl').text().trim());

    $scope.reportTotals = function (program, showName) {
        var startDate = $('#fromDate').datepicker('getDate');
        var endDate = $('#toDate').datepicker('getDate');
        var programName = '';
        if (showName || endDate.getDate() < 7) {
            programName = '*' + program.name + '*';
        }

        return totalsTpl({
            week: weekTpl({
                name: programName,
                startDate: $('#fromDate').val(),
                endDate: $('#toDate').val(),
                totalClosed: program.data[Period.week].totalClosed,
                devClosed: program.data[Period.week].successfulClosed,
                percent: program.data[Period.week].successRate
            }),
            month: monthTpl({
                startDate: $.datepicker.formatDate('M 1', endDate),
                endDate: $('#toDate').val(),
                totalClosed: program.data[Period.month].totalClosed,
                devClosed: program.data[Period.month].successfulClosed,
                percent: program.data[Period.month].successRate
            })
        });
    };

    $scope.reportSummary = function () {
        var endDate = $('#toDate').datepicker('getDate');

        return summaryTpl({
            today: $.datepicker.formatDate('m/d', endDate),
            startDate: $('#fromDate').val(),
            endDate: $('#toDate').val(),
            totals: $scope.reportTotals($scope.totals, true)
        });
    };

    $scope.currentProgram = $scope.programs[0];
    $scope.selectProgram = function (program) {
        $scope.currentProgram = program;
    };

    $scope.select = function ($event) {
        var target = $($event.target).attr('data-target');
        $(target).select();
    };
}
