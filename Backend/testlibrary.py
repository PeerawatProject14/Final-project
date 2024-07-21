import sys
import io
import pandas as pd
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
input_data = sys.stdin.read().strip()
if input_data:
    print("อินพุตถูกส่งถึง python")
else:
    print("ไม่ได้กรอกอินพุต")
sys.stdout.flush()
