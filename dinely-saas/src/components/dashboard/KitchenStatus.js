"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenStatus = KitchenStatus;
var ChartCardHeader_1 = require("./ChartCardHeader");
var DashboardCard_1 = require("./DashboardCard");
var SIZE = 168;
var STROKE = 16;
var RADIUS = (SIZE - STROKE) / 2;
var CENTER = SIZE / 2;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function KitchenStatus() {
    var capacity = 77;
    var congested = 23;
    var fluent = 100 - congested;
    var fluentLength = (fluent / 100) * CIRCUMFERENCE;
    var congestedLength = (congested / 100) * CIRCUMFERENCE;
    return (<DashboardCard_1.DashboardCard className="h-full">
      <ChartCardHeader_1.ChartCardHeader title="Kitchen Status" subtitle="Real-time capacity"/>

      <div className="flex flex-col gap-6 items-center">
        <div className="relative mx-auto shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={"0 0 ".concat(SIZE, " ").concat(SIZE)} className="-rotate-90" aria-hidden>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth={STROKE}/>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#22c55e" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={"".concat(fluentLength, " ").concat(CIRCUMFERENCE)}/>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f59e0b" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={"".concat(congestedLength, " ").concat(CIRCUMFERENCE)} strokeDashoffset={-fluentLength}/>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900">
              {capacity}%
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Capacity
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-4">
          <div className="flex-1 sm:max-w-[320px]">
            <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                Current load
              </p>
              <div className="mt-3 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500"/>
                      Fluent
                    </span>
                    <span>{fluent}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white shadow-inner">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "".concat(fluent, "%") }}/>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500"/>
                      Congested
                    </span>
                    <span className="text-amber-600">{congested}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white shadow-inner">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "".concat(congested, "%") }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 sm:max-w-[320px]">
            <div className="rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-neutral-100">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                Queue overview
              </p>
              <p className="mt-3 text-sm font-semibold text-neutral-900">
                <span className="text-emerald-600">12 orders</span> in queue ·{" "}
                <span className="text-neutral-700">~8 min</span> avg. wait
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Kitchen is operating smoothly with a light queue and quick
                turnaround.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard_1.DashboardCard>);
}
