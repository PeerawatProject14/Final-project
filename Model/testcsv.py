import csv

with open("D:\Finalproject101\project.csv", encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        print(row)
