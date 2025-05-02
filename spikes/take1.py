# python3 spikes/take1.py

def modulo3(binary_str):
    number = int(binary_str, 2)
    mod = number % 3
    return number, mod

bins = [
    "1101",
    "1110",
    "1111",
]

for bin_str in bins:
    number, mod = modulo3(bin_str)
    print(f"Modulo 3 of {bin_str} ({number}) is: {mod}")
    