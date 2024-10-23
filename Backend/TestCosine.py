import json
import sys

def main():
    # รับข้อมูล JSON จาก stdin
    input_data = sys.stdin.read().strip()
    research_data = json.loads(input_data)

    # ตัวอย่างการประมวลผล
    output_data = {
        'qwe': research_data.get('qwe', 'ไม่มีข้อมูล'),
        'name': research_data.get('name', 'ไม่มีข้อมูล'),
        'abc': research_data.get('abc', 'ไม่มีข้อมูล'),
        'PredictedLabel': research_data.get('PredictedLabel', 'ไม่มีข้อมูล')
    }

    # ส่งข้อมูล JSON กลับไปยัง Node.js
    print(json.dumps(output_data, ensure_ascii=False))
    sys.stdout.flush()

if __name__ == '__main__':
    main()
