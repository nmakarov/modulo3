// node spikes/take1.js

const modulo3 = (str) => {
    const number = parseInt(str, 2);
    mod = number % 3;
    return { number, mod };
};

const bins = [
    "1101",
    "1110",
    "1111",
];
for (let bin of bins) {
    const { number, mod } = modulo3(bin);
    console.info(`Modulo 3 of ${bin} (${number}) is: `, mod);
}
