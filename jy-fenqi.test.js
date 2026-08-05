const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "jy-fenqi.html"), "utf8");

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `找不到 ${name} 函数`);

  const bodyStart = html.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < html.length; index += 1) {
    if (html[index] === "{") depth += 1;
    if (html[index] === "}") depth -= 1;
    if (depth === 0) return html.slice(start, index + 1);
  }

  throw new Error(`${name} 函数没有闭合`);
}

function buildCustomerText(periods) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    ["asNum", "fmtMoney", "buildCustomerText"].map(extractFunction).join("\n"),
    context
  );

  return context.buildCustomerText({
    totalPrice: 15300,
    downPayment: 6120,
    tailPayment: 9180,
    periods,
    principalPerMonth: 9180 / periods,
    interestPerMonth: 229.5,
    eachPayment: 9180 / periods + 229.5,
    purchaseDateCn: "2026年8月5日",
    firstInstallmentDateCn: "2026年9月5日"
  });
}

test("3期分期本次最少1期利息", () => {
  assert.match(
    buildCustomerText(3),
    /\n\n提前还款说明：每分3期最低1期利息，本次最少1期利息，后续期数利息减半$/
  );
});

test("4期分期本次最少2期利息", () => {
  assert.match(
    buildCustomerText(4),
    /\n\n提前还款说明：每分3期最低1期利息，本次最少2期利息，后续期数利息减半$/
  );
});
