ฝากทำ frontend new ui หน่อย  โดยเอา codebase จากตัว web เรามาเป้นหลัก UI อะไรต่างๆยึดจาก ฝั่ง Prototype เรานะพี่ชาย ใน prototype คือเราเอาไว้ทำ แค่ frontend logic data อะไรเหมือนเดิมเลยนะห้ามยุ่งเราเปลี่ยนแค่หน้าตาโอเคมั้ย แต่ถ้าอันไหนเปน feature ที่ฝั่ง web frontend  เรายังไม่มี ทำ data mock ไว้ได้เลย ยุใน /api/mocks  

สรุปนะ prototype คือ design ui demo ที่เราต้องทำตาม ส่วนฝั่ง web เราตอนนี้ data logic ทุกอย่างเหมือนเดิมหมดห้ามยุ่งเด็ดขาด
ปรับได้แค่ design ui layyer ให้หน้าตาเหมือนกับ prototype  แต่ถ้า feature ที่ฝั่ง web frontend  เรายังไม่มี ทำ data mock ไว้ได้เลย ยุใน /api/mocks   

พวก part code ให้ใช้ฝั่ง web เรานะ พวก [package.json](package.json)  
ไม่ใช่ package.json ฝั่ง prototype

เพราะฝั่ง prototype dependencies เขาอาจจะไม่เหมือนเรา

ฝัง prototype จะมีแต่ Frontend ไม่มี server
เราจะเน้นให้ PM vibe design เปนหลัก

ส่วนถ้า PM จะทำ data ให้ทำเปน data mock แทน
โดยเก็บ data mock ไว้ที่ prototype/services/mock
ทุกๆที่ทำ data mock ต้องเขียน docs ไว้ให้ด้วย อยู้ใน 
prototype/services/mock เพื่อ backend หรือ ตัว web จริงจะนำไปใช้ implement ที่ถูกต้องต่อ