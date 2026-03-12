
import type { PresetUser } from '../components/PresetUserTarget';

export const PRESET_DATA: Record<string, PresetUser[]> = {
    tech: [
        {
            name: "Marques Brownlee",
            x_account: "MKBHD",
            reason: "Tech Youtuber อันดับต้นของโลก รีวิว Gadgets และ Hardware อย่างตรงไปตรงมา พร้อมวิเคราะห์ทิศทางตลาดคอนซูเมอร์เทคโนโลยี",
            followers: "6.2M", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/MKBHD"
        },
        {
            name: "Casey Newton",
            x_account: "CaseyNewton",
            reason: "ผู้ก่อตั้ง Platformer เจาะลึกข่าววงในของบริษัทโซเชีลมีเดีย นโยบายแพลตฟอร์ม และผลกระทบของเทคโนโลยีต่อสังคม",
            followers: "280K", following: "1.8K", posts: "12K",
            profile_image: "https://unavatar.io/x/CaseyNewton"
        },
        {
            name: "Cleo Abram",
            x_account: "cleoabram",
            reason: "ครีเอเตอร์สาย Optimistic Tech อธิบายเทคโนโลยีล้ำยุคอย่าง Quantum หรือ Fusion Energy ให้เข้าใจง่ายและเห็นโอกาสในอนาคต",
            followers: "150K", following: "600", posts: "2K",
            profile_image: "https://unavatar.io/x/cleoabram"
        },
        {
            name: "M.G. Siegler",
            x_account: "mgsiegler",
            reason: "พาร์ทเนอร์จาก Google Ventures วิจารณ์ทิศทางโปรดักต์ของบริษัทยักษ์ใหญ่อย่าง Apple และ Google ได้อย่างเฉียบคม",
            followers: "220K", following: "900", posts: "18K",
            profile_image: "https://unavatar.io/x/mgsiegler"
        },
        {
            name: "Joanna Stern",
            x_account: "JoannaStern",
            reason: "นักข่าวอาวุโสจาก WSJ นำเสนอเรื่องความปลอดภัยไซเบอร์ และการใช้งานเทคโนโลยีในชีวิตประจำวันแบบเข้าใจง่ายและมีอารมณ์ขัน",
            followers: "350K", following: "1.1K", posts: "14K",
            profile_image: "https://unavatar.io/x/JoannaStern"
        },
        {
            name: "Paul Graham",
            x_account: "paulg",
            reason: "ผู้ร่วมก่อตั้ง Y Combinator ปรมาจารย์ด้านการสร้างนวัตกรรม สตาร์ทอัพ และวิธีคิดของแฮกเกอร์/โปรแกรมเมอร์",
            followers: "1.8M", following: "1", posts: "20K",
            profile_image: "https://unavatar.io/x/paulg"
        },
        {
            name: "Tim Cook",
            x_account: "tim_cook",
            reason: "CEO ของ Apple อัปเดตทิศทางหลักของบริษัท วิสัยทัศน์ด้าน Privacy และความเคลื่อนไหวของระบบนิเวศ Apple",
            followers: "14.5M", following: "0", posts: "1K",
            profile_image: "https://unavatar.io/x/tim_cook"
        },
        {
            name: "Sundar Pichai",
            x_account: "sundarpichai",
            reason: "CEO ของ Google อัปเดตความก้าวหน้าด้านเทคโนโลยี Search และ AI แบบเป็นทางการของบริษัท",
            followers: "4.8M", following: "0", posts: "500",
            profile_image: "https://unavatar.io/x/sundarpichai"
        },
        {
            name: "Satya Nadella",
            x_account: "satyanadella",
            reason: "CEO ของ Microsoft แชร์วิสัยทัศน์ด้าน Cloud Computing, Enterprise Tech และการทรานส์ฟอร์มองค์กรด้วยเทคโนโลยี",
            followers: "3.2M", following: "0", posts: "300",
            profile_image: "https://unavatar.io/x/satyanadella"
        },
        {
            name: "Linus Tech Tips",
            x_account: "LinusTech",
            reason: "ตัวพ่อสายฮาร์ดแวร์คอมพิวเตอร์ รีวิวเจาะลึกชิ้นส่วนเทคโนโลยี การประกอบ PC และการทำงานของเซิร์ฟเวอร์",
            followers: "2.1M", following: "200", posts: "15K",
            profile_image: "https://unavatar.io/x/LinusTech"
        },
        {
            name: "Mark Gurman",
            x_account: "markgurman",
            reason: "นักข่าวจาก Bloomberg แหล่งข่าววงใน Apple ที่แม่นยำที่สุด อัปเดตข่าวหลุดและวิเคราะห์โปรดักต์ใหม่ก่อนเปิดตัว",
            followers: "550K", following: "800", posts: "40K",
            profile_image: "https://unavatar.io/x/markgurman"
        },
        {
            name: "Justine Ezarik",
            x_account: "ijustine",
            reason: "ครีเอเตอร์สายเทคยุคบุกเบิก นำเสนอมุมมองการใช้งาน Gadgets ที่เข้าถึงง่ายและเชื่อมโยงกับไลฟ์สไตล์",
            followers: "1.8M", following: "2K", posts: "35K",
            profile_image: "https://unavatar.io/x/ijustine"
        },
        {
            name: "Kara Swisher",
            x_account: "karaswisher",
            reason: "นักข่าวเทคโนโลยีรุ่นใหญ่ วิจารณ์ CEO ระดับท็อปอย่างตรงไปตรงมา เกาะติดประเด็นกฎหมายและการเมืองในซิลิคอนแวลลีย์",
            followers: "1.4M", following: "3K", posts: "80K",
            profile_image: "https://unavatar.io/x/karaswisher"
        },
        {
            name: "Dieter Bohn",
            x_account: "backlon",
            reason: "ผู้เชี่ยวชาญด้านฮาร์ดแวร์จาก Google ให้มุมมองด้านการออกแบบระบบนิเวศมือถือและมาตรฐานของสมาร์ทดีไวซ์",
            followers: "250K", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/backlon"
        },
        {
            name: "Aaron Levie",
            x_account: "levie",
            reason: "CEO ของ Box เชี่ยวชาญด้าน Enterprise Software มักวิเคราะห์เทรนด์ SaaS ด้วยอารมณ์ขันที่จิกกัดวงการได้ตรงจุด",
            followers: "380K", following: "2.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/levie"
        },
        {
            name: "Marc Andreessen",
            x_account: "pmarca",
            reason: "ผู้ร่วมก่อตั้ง a16z แชร์มุมมองด้าน Techno-Optimism การลงทุนในอานคตของอินเทอร์เน็ต และการผลักดันนวัตกรรม",
            followers: "1.2M", following: "0", posts: "50K",
            profile_image: "https://unavatar.io/x/pmarca"
        },
        {
            name: "MKBHD Podcast",
            x_account: "WVFRM",
            reason: "บัญชีเจาะลึกเบื้องหลังวงการเทค สัมภาษณ์นักพัฒนา และอัปเดตกระแสข่าวไอทีรายสัปดาห์",
            followers: "120K", following: "50", posts: "2K",
            profile_image: "https://unavatar.io/x/WVFRM"
        },
        {
            name: "Garry Tan",
            x_account: "garrytan",
            reason: "CEO ของ Y Combinator แชร์เทรนด์เทคโนโลยีจากมุมมองของนักลงทุน และแนวทางการพัฒนาโปรดักต์เพื่อแก้ปัญหาจริง",
            followers: "420K", following: "1.2K", posts: "10K",
            profile_image: "https://unavatar.io/x/garrytan"
        },
        {
            name: "Kevin Roose",
            x_account: "kevinroose",
            reason: "นักข่าวเทคโนโลยีจาก NYT วิเคราะห์ผลกระทบของเทคโนโลยีและ AI ที่มีต่อวัฒนธรรมและการใช้ชีวิตของมนุษย์",
            followers: "230K", following: "1.8K", posts: "12K",
            profile_image: "https://unavatar.io/x/kevinroose"
        }
    ],
    business: [
        {
            name: "Naval Ravikant",
            x_account: "naval",
            reason: "ผู้ก่อตั้ง AngelList นำเสนอปรัชญาการสร้างความมั่งคั่ง การใช้ Leverage ทางธุรกิจ และการมีอิสรภาพทางการเงิน",
            followers: "2.5M", following: "0", posts: "20K",
            profile_image: "https://unavatar.io/x/naval"
        },
        {
            name: "Alex Hormozi",
            x_account: "AlexHormozi",
            reason: "ผู้ก่อตั้ง Acquisition.com ปรมาจารย์ด้านการสร้าง Offers และการขยายสเกลธุรกิจ แบ่งปันเทคนิคเพิ่มยอดขายที่ทำได้จริง",
            followers: "1.2M", following: "400", posts: "15K",
            profile_image: "https://unavatar.io/x/AlexHormozi"
        },
        {
            name: "Sahil Bloom",
            x_account: "SahilBloom",
            reason: "เชี่ยวชาญการสรุป Framework ทางธุรกิจและ Productivity ช่วยจัดระบบความคิดให้ผู้บริหารและเจ้าของกิจการ",
            followers: "1M", following: "800", posts: "30K",
            profile_image: "https://unavatar.io/x/SahilBloom"
        },
        {
            name: "Chamath Palihapitiya",
            x_account: "chamath",
            reason: "CEO Social Capital วิเคราะห์ภาพรวมเศรษฐกิจที่กระทบต่อการตัดสินใจทางธุรกิจในอุตสาหกรรมเทคโนโลยี",
            followers: "1.6M", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/chamath"
        },
        {
            name: "Codie Sanchez",
            x_account: "Codie_Sanchez",
            reason: "ผู้เชี่ยวชาญด้าน Boring Businesses สอนเทคนิคเข้าซื้อและบริหารธุรกิจธรรมดาให้เป็นเครื่องจักรผลิตกระแสเงินสด",
            followers: "700K", following: "1.2K", posts: "25K",
            profile_image: "https://unavatar.io/x/Codie_Sanchez"
        },
        {
            name: "Shaan Puri",
            x_account: "ShaanVP",
            reason: "โฮสต์ My First Million แชร์ไอเดียธุรกิจที่ทำกำไร วิเคราะห์เคสบริษัทที่เติบโตแบบก้าวกระโดด และเทคนิค Copywriting",
            followers: "450K", following: "1.1K", posts: "12K",
            profile_image: "https://unavatar.io/x/ShaanVP"
        },
        {
            name: "Sam Parr",
            x_account: "thesamparr",
            reason: "ผู้ก่อตั้ง The Hustle ให้มุมมองด้านการทำ Media Business และวิเคราะห์โมเดลรายได้ของบริษัทต่างๆ",
            followers: "300K", following: "900", posts: "15K",
            profile_image: "https://unavatar.io/x/thesamparr"
        },
        {
            name: "Justin Welsh",
            x_account: "thejustinwelsh",
            reason: "ผู้นำเทรนด์ Solopreneurship สอนวิธีสร้าง One-Person Business และต่อยอดทักษะเฉพาะตัวเป็นรายได้",
            followers: "550K", following: "1K", posts: "10K",
            profile_image: "https://unavatar.io/x/thejustinwelsh"
        },
        {
            name: "Pieter Levels",
            x_account: "levelsio",
            reason: "Indie Hacker ระดับท็อป แชร์เบื้องหลังรายได้และการทำธุรกิจแบบไม่ต้องระดมทุน (Bootstrapped) ด้วยตัวเองคนเดียว",
            followers: "480K", following: "1.5K", posts: "60K",
            profile_image: "https://unavatar.io/x/levelsio"
        },
        {
            name: "Brian Chesky",
            x_account: "bchesky",
            reason: "CEO ของ Airbnb แชร์วิสัยทัศน์การบริหารงานที่นำด้วยดีไซน์ การสร้างประสบการณ์สุดพิเศษ และวัฒนธรรมองค์กร",
            followers: "600K", following: "800", posts: "4K",
            profile_image: "https://unavatar.io/x/bchesky"
        },
        {
            name: "Jason Calacanis",
            x_account: "Jason",
            reason: "นักลงทุน Angel ชื่อดัง โพสต์อินไซต์วงการสตาร์ทอัพ วิธี Pitch ธุรกิจให้เข้าตา VC และโมเดลธุรกิจมาแรง",
            followers: "650K", following: "3.5K", posts: "150K",
            profile_image: "https://unavatar.io/x/Jason"
        },
        {
            name: "Andrew Wilkinson",
            x_account: "awilkinson",
            reason: "ผู้ก่อตั้ง Tiny แชร์บทเรียนการเข้าซื้อกิจการ และการวางระบบให้บริษัทเดินหน้าได้เองโดยไม่ต้องพึ่งพาระบบเดิม",
            followers: "220K", following: "1.2K", posts: "8K",
            profile_image: "https://unavatar.io/x/awilkinson"
        },
        {
            name: "Noah Kagan",
            x_account: "noahkagan",
            reason: "ผู้ก่อตั้ง AppSumo ให้เทคนิคการตลาดที่จับต้องได้ วิธีทดสอบไอเดียธุรกิจ และสร้างฐานลูกค้าโดยไม่พึ่งแอด",
            followers: "400K", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/noahkagan"
        },
        {
            name: "Dickie Bush",
            x_account: "dickiebush",
            reason: "เชี่ยวชาญการสร้างธุรกิจจากการเขียน สอนวิธีทำ Digital Product และสร้าง Audience ขนาดใหญ่",
            followers: "420K", following: "1.1K", posts: "20K",
            profile_image: "https://unavatar.io/x/dickiebush"
        },
        {
            name: "Arvid Kahl",
            x_account: "arvidkahl",
            reason: "ผู้เชี่ยวชาญด้าน Bootstrapping แชร์เทคนิคสร้างโปรดักต์เจาะกลุ่ม Niche และการทำธุรกิจแบบ Build in Public",
            followers: "150K", following: "1.2K", posts: "45K",
            profile_image: "https://unavatar.io/x/arvidkahl"
        },
        {
            name: "Daniel Ek",
            x_account: "eldsjal",
            reason: "CEO ของ Spotify โพสต์กลยุทธ์อุตสาหกรรมสตรีมมิ่ง การเจาะตลาดท้องถิ่น และมุมมองการแข่งขันธุรกิจ",
            followers: "350K", following: "200", posts: "1K",
            profile_image: "https://unavatar.io/x/eldsjal"
        },
        {
            name: "Reid Hoffman",
            x_account: "reidhoffman",
            reason: "ผู้ร่วมก่อตั้ง LinkedIn แชร์เทคนิค Blitzscaling เพื่อสเกลธุรกิจอย่างรวดเร็ว และศิลปะการบริหารคอนเนคชัน",
            followers: "750K", following: "2.5K", posts: "12K",
            profile_image: "https://unavatar.io/x/reidhoffman"
        },
        {
            name: "Richard Branson",
            x_account: "richardbranson",
            reason: "ผู้ก่อตั้ง Virgin Group แชร์แนวคิดผู้นำที่ใส่ใจบุคลากร การบริหารความเสี่ยง และการเป็นผู้ประกอบการนอกกรอบ",
            followers: "12.5M", following: "3.2K", posts: "25K",
            profile_image: "https://unavatar.io/x/richardbranson"
        },
        {
            name: "Ray Dalio",
            x_account: "RayDalio",
            reason: "ผู้ก่อตั้ง Bridgewater วิเคราะห์วัฏจักรธุรกิจและแชร์หลักการบริหารความขัดแย้งเพื่อพัฒนาบุคลากรในองค์กร",
            followers: "1.4M", following: "100", posts: "3K",
            profile_image: "https://unavatar.io/x/RayDalio"
        },
        {
            name: "Jack Butcher",
            x_account: "jackbutcher",
            reason: "ผู้ก่อตั้ง Visualize Value สอนการสร้างมูลค่าเพิ่ม (Value) จากการสื่อสารบนโลกออนไลน์ด้วยกราฟิกมินิมอล",
            followers: "380K", following: "1.2K", posts: "35K",
            profile_image: "https://unavatar.io/x/jackbutcher"
        }
    ],
    marketing: [
        {
            name: "Gary Vaynerchuk",
            x_account: "garyvee",
            reason: "CEO ของ VaynerMedia ตัวพ่อด้านการตลาดดิจิทัล แชร์กลยุทธ์โซเชียลมีเดีย การสร้าง Personal Brand และเทรนด์ Content Marketing",
            followers: "3.1M", following: "30K", posts: "200K",
            profile_image: "https://unavatar.io/x/garyvee"
        },
        {
            name: "Neil Patel",
            x_account: "neilpatel",
            reason: "ผู้เชี่ยวชาญด้าน SEO และ Digital Marketing ระดับโลก แชร์เทคนิคการเพิ่ม Traffic, Conversion Rate และ Inbound Marketing",
            followers: "450K", following: "50", posts: "15K",
            profile_image: "https://unavatar.io/x/neilpatel"
        },
        {
            name: "Seth Godin",
            x_account: "ThisIsSethsBlog",
            reason: "ปรมาจารย์ด้านการตลาดสมัยใหม่ ผู้เขียน Purple Cow เน้นปรัชญาการตลาดที่สร้างคุณค่า การเล่าเรื่อง และการสร้าง Tribe",
            followers: "780K", following: "10", posts: "50K",
            profile_image: "https://unavatar.io/x/ThisIsSethsBlog"
        },
        {
            name: "Ann Handley",
            x_account: "MarketingProfs",
            reason: "ผู้เชี่ยวชาญด้าน Content Marketing สอนเทคนิคการเขียน Copywriting ให้มีประสิทธิภาพและสื่อสารกับลูกค้าได้โดนใจ",
            followers: "420K", following: "1.2K", posts: "45K",
            profile_image: "https://unavatar.io/x/MarketingProfs"
        },
        {
            name: "Matt Navarra",
            x_account: "MattNavarra",
            reason: "Social Media Consultant สายข่าว อัปเดตฟีเจอร์ใหม่ของทุกแพลตฟอร์มโซเชียลมีเดียแบบ Real-time เหมาะสำหรับนักการตลาดที่ต้องตามเทรนด์",
            followers: "180K", following: "2.5K", posts: "120K",
            profile_image: "https://unavatar.io/x/MattNavarra"
        },
        {
            name: "Rand Fishkin",
            x_account: "randfish",
            reason: "อดีตผู้ก่อตั้ง Moz ปัจจุบันทำ SparkToro เชี่ยวชาญการวิเคราะห์พฤติกรรมผู้บริโภค SEO เชิงลึก และ Audience Research",
            followers: "450K", following: "1.8K", posts: "35K",
            profile_image: "https://unavatar.io/x/randfish"
        },
        {
            name: "Brian Halligan",
            x_account: "bhalligan",
            reason: "ผู้ร่วมก่อตั้ง HubSpot ผู้บุกเบิกคำว่า Inbound Marketing แชร์แนวคิดการตลาดยุคใหม่ที่เน้นดึงดูดลูกค้าแทนการยัดเยียด",
            followers: "120K", following: "1.5K", posts: "10K",
            profile_image: "https://unavatar.io/x/bhalligan"
        },
        {
            name: "Ryan Deiss",
            x_account: "RyanDeiss",
            reason: "ผู้ก่อตั้ง DigitalMarketer.com สอนเรื่อง Funnel Marketing กลยุทธ์การยิงแอด และการเปลี่ยน Lead ให้เป็นลูกค้า",
            followers: "150K", following: "1.1K", posts: "25K",
            profile_image: "https://unavatar.io/x/RyanDeiss"
        },
        {
            name: "Russell Brunson",
            x_account: "russellbrunson",
            reason: "ผู้ก่อตั้ง ClickFunnels ปรมาจารย์ด้าน Sales Funnel สอนวิธีสร้างหน้าแลนดิ้งเพจและกระบวนการปิดการขายที่ได้ผลสูงสุด",
            followers: "280K", following: "500", posts: "15K",
            profile_image: "https://unavatar.io/x/russellbrunson"
        },
        {
            name: "Mari Smith",
            x_account: "MariSmith",
            reason: "ราชินีแห่ง Facebook Marketing แชร์อัลกอริทึมล่าสุดของ Meta เทคนิคการทำโฆษณา และการสร้าง Engagement บน Facebook",
            followers: "580K", following: "2.5K", posts: "80K",
            profile_image: "https://unavatar.io/x/MariSmith"
        },
        {
            name: "Amy Porterfield",
            x_account: "AmyPorterfield",
            reason: "เชี่ยวชาญด้าน Email Marketing และการสร้างคอร์สออนไลน์ สอนวิธี List Building และเปลี่ยนผู้ติดตามให้เป็นรายได้",
            followers: "220K", following: "1.2K", posts: "18K",
            profile_image: "https://unavatar.io/x/AmyPorterfield"
        },
        {
            name: "Joanna Wiebe",
            x_account: "copyhackers",
            reason: "ผู้ก่อตั้ง Copyhackers สอนเทคนิค Conversion Copywriting เจาะลึกจิตวิทยาการใช้คำเพื่อเพิ่มยอดขายโดยเฉพาะ",
            followers: "120K", following: "1.8K", posts: "25K",
            profile_image: "https://unavatar.io/x/copyhackers"
        },
        {
            name: "Peep Laja",
            x_account: "peeplaja",
            reason: "ผู้ก่อตั้ง CXL เชี่ยวชาญด้าน Conversion Rate Optimization (CRO) และ B2B Marketing เน้นการทดสอบ A/B Testing และ Data-driven",
            followers: "150K", following: "1.5K", posts: "20K",
            profile_image: "https://unavatar.io/x/peeplaja"
        },
        {
            name: "Hiten Shah",
            x_account: "hnshah",
            reason: "เชี่ยวชาญด้าน SaaS Marketing ให้ความรู้เรื่องการหา Product-Market Fit และกลยุทธ์การเติบโตแบบ Product-led Growth",
            followers: "280K", following: "2.1K", posts: "50K",
            profile_image: "https://unavatar.io/x/hnshah"
        },
        {
            name: "Sujan Patel",
            x_account: "sujanpatel",
            reason: "Growth Hacker ระดับท็อป แชร์เทคนิค B2B Marketing การทำ Cold Email และกลยุทธ์เพิ่มยอดขายสำหรับ Startup",
            followers: "120K", following: "1.8K", posts: "15K",
            profile_image: "https://unavatar.io/x/sujanpatel"
        },
        {
            name: "Aleyda Solis",
            x_account: "aleyda",
            reason: "ผู้เชี่ยวชาญ International SEO แชร์เทคนิคการทำ SEO ระดับ Advance, Technical SEO และการปรับแต่งเว็บไซต์ให้ติดหน้าแรก",
            followers: "150K", following: "1.2K", posts: "60K",
            profile_image: "https://unavatar.io/x/aleyda"
        },
        {
            name: "Barry Schwartz",
            x_account: "rustybrick",
            reason: "นักข่าวสาย SEO จาก Search Engine Land อัปเดตความเคลื่อนไหวอัลกอริทึมของ Google แบบเกาะติดทุกสถานการณ์",
            followers: "220K", following: "2.5K", posts: "300K",
            profile_image: "https://unavatar.io/x/rustybrick"
        },
        {
            name: "Lily Ray",
            x_account: "lilyraynyc",
            reason: "ผู้เชี่ยวชาญ SEO ที่เน้นเรื่อง E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) ของ Google และผลกระทบของ AI ต่อ Search",
            followers: "180K", following: "1.5K", posts: "40K",
            profile_image: "https://unavatar.io/x/lilyraynyc"
        },
        {
            name: "Joe Pulizzi",
            x_account: "JoePulizzi",
            reason: "ผู้ก่อตั้ง Content Marketing Institute บิดาแห่งวงการคอนเทนต์มาร์เก็ตติ้ง สอนการสร้างโมเดลธุรกิจจากเนื้อหา",
            followers: "150K", following: "1.1K", posts: "35K",
            profile_image: "https://unavatar.io/x/JoePulizzi"
        },
        {
            name: "Amanda Natividad",
            x_account: "amandanat",
            reason: "VP of Marketing ที่ SparkToro แชร์เทคนิค Audience Research การทำ B2B Marketing และ Zero-click Content ที่กำลังมาแรง",
            followers: "110K", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/amandanat"
        }
    ],
    finance: [
        {
            name: "Morgan Housel",
            x_account: "morganhousel",
            reason: "ผู้เขียน The Psychology of Money แชร์ปรัชญาการเงิน พฤติกรรมมนุษย์กับการใช้เงิน และแนวคิดการสร้างความมั่งคั่งระยะยาว",
            followers: "500K", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/morganhousel"
        },
        {
            name: "Ramit Sethi",
            x_account: "ramit",
            reason: "ผู้เขียน I Will Teach You to Be Rich นำเสนอแนวคิดการใช้เงินกับสิ่งที่รัก (Rich Life) และการบริหารการเงินส่วนบุคคลแบบไม่อดอยาก",
            followers: "300K", following: "400", posts: "12K",
            profile_image: "https://unavatar.io/x/ramit"
        },
        {
            name: "Dave Ramsey",
            x_account: "DaveRamsey",
            reason: "ผู้เชี่ยวชาญการปลดหนี้ระดับตำนาน เน้นหลักการ Baby Steps ในการบริหารเงิน การตัดบัตรเครดิต และการสร้างกองทุนฉุกเฉิน",
            followers: "1.1M", following: "100", posts: "15K",
            profile_image: "https://unavatar.io/x/DaveRamsey"
        },
        {
            name: "Robert Kiyosaki",
            x_account: "theRealKiyosaki",
            reason: "ผู้เขียน Rich Dad Poor Dad แชร์มุมมองด้านกระแสเงินสด การป้องกันความเสี่ยงจากเงินเฟ้อ และการลงทุนในสินทรัพย์จริง",
            followers: "2.5M", following: "50", posts: "8K",
            profile_image: "https://unavatar.io/x/theRealKiyosaki"
        },
        {
            name: "Anthony Pompliano",
            x_account: "APompliano",
            reason: "นักวิเคราะห์การเงินที่เชื่อมโยงโลกการเงินแบบดั้งเดิมเข้ากับสินทรัพย์ดิจิทัล วิเคราะห์นโยบายการเงินและทิศทางดอกเบี้ย",
            followers: "1.6M", following: "1K", posts: "40K",
            profile_image: "https://unavatar.io/x/APompliano"
        },
        {
            name: "Graham Stephan",
            x_account: "GrahamStephan",
            reason: "Youtuber สายการเงินส่วนบุคคล แชร์เทคนิคการประหยัดเงิน การสร้าง Credit Score และการลงทุนอสังหาริมทรัพย์",
            followers: "850K", following: "300", posts: "10K",
            profile_image: "https://unavatar.io/x/GrahamStephan"
        },
        {
            name: "Andrei Jikh",
            x_account: "andreijikh",
            reason: "เน้นเรื่องการลงทุนแบบเน้นปันผล (Dividend Investing) มายากลการเงิน และการวิเคราะห์งบการเงินแบบเข้าใจง่าย",
            followers: "250K", following: "200", posts: "4K",
            profile_image: "https://unavatar.io/x/andreijikh"
        },
        {
            name: "Humphrey Yang",
            x_account: "HumphreyTalks",
            reason: "อดีตที่ปรึกษาการเงิน อธิบายกลไกเศรษฐศาสตร์ ภาษี และเทคนิคการจัดการเงินส่วนบุคคลด้วยคลิปวิดีโอสั้นและภาพกราฟิก",
            followers: "150K", following: "400", posts: "2K",
            profile_image: "https://unavatar.io/x/HumphreyTalks"
        },
        {
            name: "Nicole Lapin",
            x_account: "NicoleLapin",
            reason: "ผู้เชี่ยวชาญการเงินสำหรับผู้หญิง สอนเรื่องการลงทุน การขอขึ้นเงินเดือน และการจัดการงบประมาณแบบไลฟ์สไตล์",
            followers: "80K", following: "500", posts: "3K",
            profile_image: "https://unavatar.io/x/NicoleLapin"
        },
        {
            name: "Farnoosh Torabi",
            x_account: "FARNOOSH",
            reason: "โฮสต์ So Money podcast ให้คำแนะนำเรื่องการเงินครอบครัว จิตวิทยาการเงิน และการวางแผนเกษียณ",
            followers: "120K", following: "1K", posts: "8K",
            profile_image: "https://unavatar.io/x/FARNOOSH"
        },
        {
            name: "Chelsea Fagan",
            x_account: "Chelsea_Fagan",
            reason: "ผู้ก่อตั้ง The Financial Diet นำเสนอการเงินแบบเข้าถึงได้สำหรับคนรุ่นใหม่ เจาะลึกผลกระทบของทุนนิยมต่อพฤติกรรมการใช้จ่าย",
            followers: "150K", following: "800", posts: "15K",
            profile_image: "https://unavatar.io/x/Chelsea_Fagan"
        },
        {
            name: "Vivian Tu",
            x_account: "YourRichBFF",
            reason: "อดีตเทรดเดอร์ Wall Street แชร์เคล็ดลับ \"เงินที่โรงเรียนไม่ได้สอน\" กฎหมายแรงงาน และเทคนิคบริหารเงินฉับคนทำงาน",
            followers: "400K", following: "600", posts: "5K",
            profile_image: "https://unavatar.io/x/YourRichBFF"
        },
        {
            name: "Haley Sacks",
            x_account: "mrsdowjones",
            reason: "ผสมผสาน Pop Culture เข้ากับการเงิน (Financial Pop Culture) ทำให้เรื่องงบประมาณและการลงทุนกลายเป็นเรื่องสนุกและเข้าใจง่าย",
            followers: "350K", following: "700", posts: "6K",
            profile_image: "https://unavatar.io/x/mrsdowjones"
        },
        {
            name: "Taylor Price",
            x_account: "pricelesstay",
            reason: "Gen-Z Finance Expert สอนเรื่องการเงินเบื้องต้นสำหรับวัยรุ่น การลงทุนในกองทุนรวม และเทคนิคหาเงินออนไลน์",
            followers: "110K", following: "1.2K", posts: "10K",
            profile_image: "https://unavatar.io/x/pricelesstay"
        },
        {
            name: "Kyla Scanlon",
            x_account: "kylascan",
            reason: "ผู้สร้างคำว่า \"Vibecession\" อธิบายเศรษฐศาสตร์มหภาค นโยบาย Fed และตลาดทุนผ่านวิดีโอสั้นเชิงเสียดสีและเข้าใจง่าย",
            followers: "180K", following: "1.5K", posts: "20K",
            profile_image: "https://unavatar.io/x/kylascan"
        },
        {
            name: "Lyn Alden",
            x_account: "LynAldenContact",
            reason: "นักวิเคราะห์การเงินมหภาคเชิงลึก เจาะข้อมูลสถิติพันธบัตรรัฐบาล อัตราเงินเฟ้อ และระบบการเงินโลกแบบละเอียดยิบ",
            followers: "320K", following: "1.2K", posts: "45K",
            profile_image: "https://unavatar.io/x/LynAldenContact"
        },
        {
            name: "Jim Cramer",
            x_account: "jimcramer",
            reason: "โฮสต์รายการ Mad Money วิเคราะห์หุ้นรายวัน ทิศทางตลาด Wall Street และข่าวสารการเงินแบบฉับไว",
            followers: "1.8M", following: "500", posts: "100K",
            profile_image: "https://unavatar.io/x/jimcramer"
        },
        {
            name: "Peter Schiff",
            x_account: "PeterSchiff",
            reason: "นักเศรษฐศาสตร์สายทองคำและ Austrian Economics วิจารณ์นโยบายพิมพ์เงินของ Fed และเตือนถึงวิกฤตเศรษฐกิจ",
            followers: "950K", following: "200", posts: "50K",
            profile_image: "https://unavatar.io/x/PeterSchiff"
        },
        {
            name: "Cathie Wood",
            x_account: "CathieDWood",
            reason: "CEO ของ ARK Invest วิเคราะห์การเงินผ่านมุมมองของ Disruptive Innovation และการประเมินมูลค่าบริษัทเทคโนโลยีล้ำยุค",
            followers: "1.5M", following: "100", posts: "10K",
            profile_image: "https://unavatar.io/x/CathieDWood"
        },
        {
            name: "Brian Feroldi",
            x_account: "BrianFeroldi",
            reason: "สอนการวิเคราะห์งบการเงินบริษัท อ่านงบดุล และแนวคิดการลงทุนในหุ้นเติบโตด้วยภาษาที่มือใหม่เข้าใจได้",
            followers: "400K", following: "800", posts: "40K",
            profile_image: "https://unavatar.io/x/BrianFeroldi"
        }
    ],
    investment: [
        {
            name: "Ray Dalio",
            x_account: "RayDalio",
            reason: "ผู้ก่อตั้ง Bridgewater แชร์มุมมองด้านวัฏจักรเศรษฐกิจโลก (Macroeconomics) การกระจายความเสี่ยง และหลักการลงทุนระดับสถาบัน",
            followers: "1.4M", following: "100", posts: "3K",
            profile_image: "https://unavatar.io/x/RayDalio"
        },
        {
            name: "Howard Marks",
            x_account: "howardmarksbook",
            reason: "ผู้ก่อตั้ง Oaktree Capital เชี่ยวชาญเรื่องการประเมินความเสี่ยง วัฏจักรตลาด และจิตวิทยาการลงทุน (Market Cycles)",
            followers: "200K", following: "50", posts: "1K",
            profile_image: "https://unavatar.io/x/howardmarksbook"
        },
        {
            name: "Bill Ackman",
            x_account: "BillAckman",
            reason: "CEO ของ Pershing Square ทวีตเกี่ยวกับกลยุทธ์ Activist Investing การวิเคราะห์หุ้นรายตัว และประเด็นเศรษฐกิจการเมืองที่กระทบตลาด",
            followers: "1.2M", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/BillAckman"
        },
        {
            name: "Chamath Palihapitiya",
            x_account: "chamath",
            reason: "วิเคราะห์เทรนด์การลงทุนในอนาคต (SPACs, Tech) และการจัดสรรเงินทุนเพื่อสเกลธุรกิจระดับโลก",
            followers: "1.6M", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/chamath"
        },
        {
            name: "Jason Calacanis",
            x_account: "Jason",
            reason: "นักลงทุน Angel ชื่อดัง โพสต์เทคนิคการลงทุนใน Startup ระยะเริ่มต้น (Early-stage) และการมองหา ยูนิคอร์น ตัวต่อไป",
            followers: "650K", following: "3.5K", posts: "150K",
            profile_image: "https://unavatar.io/x/Jason"
        },
        {
            name: "Paul Graham",
            x_account: "paulg",
            reason: "แชร์ปรัชญาการเลือกลงทุนในผู้ก่อตั้ง (Founders) มากกว่าไอเดีย และการวิเคราะห์ศักยภาพของ Startup",
            followers: "1.8M", following: "1", posts: "20K",
            profile_image: "https://unavatar.io/x/paulg"
        },
        {
            name: "Marc Andreessen",
            x_account: "pmarca",
            reason: "แชร์วิสัยทัศน์การลงทุนในเทคโนโลยีที่จะเปลี่ยนโลก (Software is eating the world) และเทรนด์ VC",
            followers: "1.2M", following: "0", posts: "50K",
            profile_image: "https://unavatar.io/x/pmarca"
        },
        {
            name: "Michael Burry",
            x_account: "michaeljburry",
            reason: "นักลงทุนระดับตำนานจาก The Big Short มักทวีตเตือนเรื่องฟองสบู่ในตลาดทุน และการวิเคราะห์มูลค่าที่แท้จริงแบบสวนกระแส",
            followers: "1.1M", following: "0", posts: "1K",
            profile_image: "https://unavatar.io/x/michaeljburry"
        },
        {
            name: "Carl Icahn",
            x_account: "Carl_C_Icahn",
            reason: "นักลงทุนสาย Activist ระดับตำนาน อัปเดตความเคลื่อนไหวในการเข้าซื้อกิจการและการกดดันบอร์ดบริหารเพื่อสร้างมูลค่าหุ้น",
            followers: "400K", following: "100", posts: "500",
            profile_image: "https://unavatar.io/x/Carl_C_Icahn"
        },
        {
            name: "Ian Cassel",
            x_account: "iancassel",
            reason: "เชี่ยวชาญด้าน MicroCap Investing เน้นหาหุ้นขนาดเล็กที่มีศักยภาพเติบโต 100 เท่า และเทคนิคการถือยาว",
            followers: "250K", following: "1K", posts: "40K",
            profile_image: "https://unavatar.io/x/iancassel"
        },
        {
            name: "Sahil Bloom",
            x_account: "SahilBloom",
            reason: "แชร์ Framework การจัดพอร์ตลงทุน การลงทุนใน Private Equity และการวิเคราะห์จังหวะตลาด",
            followers: "1M", following: "800", posts: "30K",
            profile_image: "https://unavatar.io/x/SahilBloom"
        },
        {
            name: "Tren Griffin",
            x_account: "trengriffin",
            reason: "สรุปบทเรียนและปรัชญาการลงทุนจากนักลงทุนระดับโลกอย่าง Charlie Munger และ Warren Buffett",
            followers: "150K", following: "1.2K", posts: "25K",
            profile_image: "https://unavatar.io/x/trengriffin"
        },
        {
            name: "Meb Faber",
            x_account: "MebFaber",
            reason: "เชี่ยวชาญด้าน Quantitative Investing, Asset Allocation และการลงทุนใน ETF ระดับสากล",
            followers: "120K", following: "1.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/MebFaber"
        },
        {
            name: "Ben Carlson",
            x_account: "awealthofcs",
            reason: "อธิบายความผันผวนของตลาดหุ้น สถิติการลงทุนย้อนหลัง และสอนให้มีสติในการลงทุนระยะยาวผ่านพอร์ตโฟลิโอ",
            followers: "250K", following: "1K", posts: "20K",
            profile_image: "https://unavatar.io/x/awealthofcs"
        },
        {
            name: "Michael Batnick",
            x_account: "michaelbatnick",
            reason: "นักวิเคราะห์การลงทุนที่ผสมผสานข้อมูลกราฟิกเข้ากับสถานการณ์ตลาดจริง เพื่อให้นักลงทุนรายย่อยรับมือกับความผันผวนได้",
            followers: "180K", following: "900", posts: "18K",
            profile_image: "https://unavatar.io/x/michaelbatnick"
        },
        {
            name: "Charlie Bilello",
            x_account: "charliebilello",
            reason: "เจ้าพ่อข้อมูลสถิติตลาดทุน แชร์กราฟและตัวเลขเศรษฐกิจ (เงินเฟ้อ, ดอกเบี้ย, ผลตอบแทนหุ้น) แบบอัปเดตรายวัน",
            followers: "550K", following: "1K", posts: "25K",
            profile_image: "https://unavatar.io/x/charliebilello"
        },
        {
            name: "Gurgavin",
            x_account: "gurgavin",
            reason: "แชร์ข่าวเด่นของตลาดหุ้น Wall Street แบบ Real-time การเคลื่อนไหวของ Option ขนาดใหญ่ และรายงานผลประกอบการ",
            followers: "380K", following: "600", posts: "100K",
            profile_image: "https://unavatar.io/x/gurgavin"
        },
        {
            name: "Julian Klymochko",
            x_account: "JulianKlymochko",
            reason: "เชี่ยวชาญการลงทุนแบบ Arbitrage, SPACs และการควบรวมกิจการ (M&A) เพื่อหาผลตอบแทนความเสี่ยงต่ำ",
            followers: "80K", following: "1.2K", posts: "30K",
            profile_image: "https://unavatar.io/x/JulianKlymochko"
        },
        {
            name: "Brian Feroldi",
            x_account: "BrianFeroldi",
            reason: "นักลงทุนสาย Growth เน้นสอนวิธีเลือกหุ้นพื้นฐานดี การอ่านงบการเงิน และเช็กลิสต์ก่อนตัดสินใจซื้อหุ้น",
            followers: "400K", following: "800", posts: "40K",
            profile_image: "https://unavatar.io/x/BrianFeroldi"
        }
    ],
    crypto: [
        {
            name: "Vitalik Buterin",
            x_account: "VitalikButerin",
            reason: "ผู้ร่วมก่อตั้ง Ethereum วิเคราะห์เชิงลึกด้านเทคโนโลยีบล็อกเชน ปรัชญาความไร้ศูนย์กลาง (Decentralization) และแนวทางการสเกลเครือข่าย",
            followers: "5.3M", following: "300", posts: "20K",
            profile_image: "https://unavatar.io/x/VitalikButerin"
        },
        {
            name: "Changpeng Zhao",
            x_account: "cz_binance",
            reason: "ผู้ก่อตั้ง Binance อัปเดตข่าวสารอุตสาหกรรมคริปโตระดับโลก แนวโน้มตลาด และนโยบายการกำกับดูแลสินทรัพย์ดิจิทัล",
            followers: "8.5M", following: "1.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/cz_binance"
        },
        {
            name: "Brian Armstrong",
            x_account: "brian_armstrong",
            reason: "CEO ของ Coinbase เป็นกระบอกเสียงสำคัญด้านกฎหมายและนโยบายคริปโตในสหรัฐฯ และการผลักดัน Web3 ให้คนทั่วไปเข้าถึงได้",
            followers: "1.2M", following: "1K", posts: "5K",
            profile_image: "https://unavatar.io/x/brian_armstrong"
        },
        {
            name: "Michael Saylor",
            x_account: "saylor",
            reason: "CEO ของ MicroStrategy และ Bitcoin Maximalist ตัวยง โพสต์สถิติ ข้อมูลเชิงมหภาค และปรัชญาว่าทำไม Bitcoin ถึงเป็นสินทรัพย์ที่ดีที่สุด",
            followers: "3.2M", following: "100", posts: "10K",
            profile_image: "https://unavatar.io/x/saylor"
        },
        {
            name: "Anthony Pompliano",
            x_account: "APompliano",
            reason: "นักลงทุนผู้เชื่อมโยงโลกการเงินดั้งเดิมกับคริปโต วิเคราะห์ทิศทางราคา Bitcoin สัมภาษณ์ผู้บริหาร และสรุปจดหมายข่าวเศรษฐกิจแบบอ่านง่าย",
            followers: "1.6M", following: "1K", posts: "40K",
            profile_image: "https://unavatar.io/x/APompliano"
        },
        {
            name: "PlanB",
            x_account: "100trillionUSD",
            reason: "ผู้คิดค้นโมเดล Stock-to-Flow (S2F) ของ Bitcoin โพสต์กราฟวิเคราะห์แนวโน้มราคาแบบ On-chain และข้อมูลเชิงสถิติที่นักเทรดติดตามเหนียวแน่น",
            followers: "1.8M", following: "500", posts: "15K",
            profile_image: "https://unavatar.io/x/100trillionUSD"
        },
        {
            name: "Willy Woo",
            x_account: "woonomic",
            reason: "นักวิเคราะห์ On-chain แถวหน้าของวงการ แปลงข้อมูลธุรกรรมบนบล็อกเชนให้เป็นกราฟคาดการณ์ทิศทางตลาดที่มีความแม่นยำสูง",
            followers: "1.1M", following: "400", posts: "8K",
            profile_image: "https://unavatar.io/x/woonomic"
        },
        {
            name: "ZachXBT",
            x_account: "zachxbt",
            reason: "นักสืบไซเบอร์แห่งโลกคริปโต (Crypto Sleuth) คอยแฉโปรเจกต์หลอกลวง (Scam) ติดตามเส้นทางเงินของแฮกเกอร์ และเตือนภัยผู้ใช้งานแบบ Real-time",
            followers: "550K", following: "600", posts: "12K",
            profile_image: "https://unavatar.io/x/zachxbt"
        },
        {
            name: "Arthur Hayes",
            x_account: "CryptoHayes",
            reason: "ผู้ก่อตั้ง BitMEX เขียนบทความวิเคราะห์เศรษฐกิจมหภาคผสมผสานกับคริปโต คาดการณ์รอบตลาดกระทิง/หมีด้วยมุมมองที่ดุดันและมีเอกลักษณ์",
            followers: "480K", following: "200", posts: "5K",
            profile_image: "https://unavatar.io/x/CryptoHayes"
        },
        {
            name: "Cobie",
            x_account: "cobie",
            reason: "ผู้มีอิทธิพลยุคบุกเบิกในโลกคริปโต โฮสต์พอดแคสต์ UpOnly วิจารณ์โปรเจกต์ต่างๆ อย่างตรงไปตรงมา และมี Engagement จากคนในวงการสูงมาก",
            followers: "750K", following: "1.2K", posts: "10K",
            profile_image: "https://unavatar.io/x/cobie"
        },
        {
            name: "Raoul Pal",
            x_account: "RaoulGMI",
            reason: "CEO ของ Real Vision นำเสนอมุมมองเศรษฐกิจมหภาคที่เชื่อมโยงกับการเติบโตของเทคโนโลยี และวัฏจักรการเปิดรับคริปโต (Adoption Curve)",
            followers: "1M", following: "800", posts: "25K",
            profile_image: "https://unavatar.io/x/RaoulGMI"
        },
        {
            name: "Chris Dixon",
            x_account: "cdixon",
            reason: "พาร์ทเนอร์จาก a16z crypto นำเสนอปรัชญาของ Web3 ประวัติศาสตร์อินเทอร์เน็ต และเหตุผลที่บล็อกเชนจะมาปฏิวัติระบบเศรษฐกิจครีเอเตอร์",
            followers: "850K", following: "1.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/cdixon"
        },
        {
            name: "Balaji Srinivasan",
            x_account: "balajis",
            reason: "อดีต CTO ของ Coinbase นักคิดด้าน \"Network State\" วิเคราะห์ผลกระทบของคริปโตต่อภูมิรัฐศาสตร์ และการสร้างประเทศบนโลกดิจิทัล",
            followers: "900K", following: "2K", posts: "30K",
            profile_image: "https://unavatar.io/x/balajis"
        },
        {
            name: "Anatoly Yakovenko",
            x_account: "aeyakovenko",
            reason: "ผู้ร่วมก่อตั้ง Solana อัปเดตการพัฒนาเชน ความเร็วในการทำธุรกรรม และมีส่วนร่วมกับชุมชนนักพัฒนา Web3 อย่างสม่ำเสมอ",
            followers: "350K", following: "1.2K", posts: "8K",
            profile_image: "https://unavatar.io/x/aeyakovenko"
        },
        {
            name: "Hayden Adams",
            x_account: "haydenzadams",
            reason: "ผู้สร้าง Uniswap อัปเดตความรู้ด้าน DeFi (Decentralized Finance) การพัฒนาศูนย์ซื้อขายแบบไร้ตัวกลาง และทิศทางของสภาพคล่องบนเชน",
            followers: "280K", following: "800", posts: "5K",
            profile_image: "https://unavatar.io/x/haydenzadams"
        },
        {
            name: "Ryan Sean Adams",
            x_account: "RyanSAdams",
            reason: "ผู้ร่วมก่อตั้ง Bankless นำเสนอแนวคิดการไร้พึ่งพาธนาคาร (Bankless lifestyle) ความรู้ด้าน DeFi และการวิเคราะห์โครงสร้างพื้นฐานของ Ethereum",
            followers: "250K", following: "1.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/RyanSAdams"
        },
        {
            name: "Nic Carter",
            x_account: "nic__carter",
            reason: "นักลงทุนจาก Castle Island Ventures เชี่ยวชาญด้านข้อมูล Bitcoin Stablecoins และมักใช้ข้อมูลจริงเพื่อโต้แย้งความเชื่อผิดๆ เรื่องการใช้พลังงานของคริปโต",
            followers: "380K", following: "1.8K", posts: "20K",
            profile_image: "https://unavatar.io/x/nic__carter"
        },
        {
            name: "Miles Deutscher",
            x_account: "milesdeutscher",
            reason: "นักวิเคราะห์คริปโตสายเกาะติดเทรนด์ นำเสนอ Narrative สดใหม่ แจกโพย Airdrop และสรุปข่าวสำคัญประจำสัปดาห์สำหรับนักเทรดรายย่อย",
            followers: "520K", following: "1.1K", posts: "12K",
            profile_image: "https://unavatar.io/x/milesdeutscher"
        },
        {
            name: "Pentoshi",
            x_account: "Pentosh1",
            reason: "นักเทรดคริปโตที่ได้รับการยอมรับสูง แชร์กราฟวิเคราะห์ทางเทคนิค (TA) จิตวิทยาการเทรด และมุมมองทิศทางตลาดระยะสั้น-กลาง",
            followers: "800K", following: "1.2K", posts: "35K",
            profile_image: "https://unavatar.io/x/Pentosh1"
        },
        {
            name: "Hsaka",
            x_account: "HsakaTrades",
            reason: "บัญชีที่นักเทรดต้องติดตาม อัปเดตข่าวสารสำคัญที่กระทบราคาคริปโตแบบรวดเร็วฉับไว และวิเคราะห์กราฟด้วยความแม่นยำ",
            followers: "550K", following: "900", posts: "25K",
            profile_image: "https://unavatar.io/x/HsakaTrades"
        }
    ],
    health: [
        {
            name: "Andrew Huberman",
            x_account: "hubermanlab",
            reason: "นักประสาทวิทยาจาก Stanford ผู้จัดพอดแคสต์สุขภาพอันดับ 1 สอนวิธีปรับฮอร์โมน การนอนหลับ และการออกกำลังกายด้วยวิทยาศาสตร์ที่ทำตามได้จริง",
            followers: "1.2M", following: "500", posts: "15K",
            profile_image: "https://unavatar.io/x/hubermanlab"
        },
        {
            name: "Peter Attia",
            x_account: "PeterAttiaMD",
            reason: "แพทย์ผู้เชี่ยวชาญด้าน Longevity (การมีอายุยืนยาวแบบสุขภาพดี) เจาะลึกวิทยาศาสตร์การเผาผลาญ การออกกำลังกายเพื่อยืดอายุขัย และการป้องกันโรคเสื่อม",
            followers: "450K", following: "300", posts: "8K",
            profile_image: "https://unavatar.io/x/PeterAttiaMD"
        },
        {
            name: "Rhonda Patrick",
            x_account: "foundmyfitness",
            reason: "นักวิจัยด้านโภชนาการและพันธุกรรม อธิบายงานวิจัยเชิงลึกเกี่ยวกับการอบซาวน่า การอดอาหาร (Fasting) และวิตามินที่ส่งผลต่อระดับเซลล์",
            followers: "580K", following: "400", posts: "12K",
            profile_image: "https://unavatar.io/x/foundmyfitness"
        },
        {
            name: "David Sinclair",
            x_account: "davidasinclair",
            reason: "ศาสตราจารย์จาก Harvard ผู้บุกเบิกงานวิจัยด้านการชะลอวัย (Anti-aging) แชร์ความก้าวหน้าทางวิทยาศาสตร์ที่สามารถย้อนวัยเซลล์มนุษย์ได้",
            followers: "420K", following: "200", posts: "5K",
            profile_image: "https://unavatar.io/x/davidasinclair"
        },
        {
            name: "Matthew Walker",
            x_account: "sleepdiplomat",
            reason: "นักวิทยาศาสตร์ด้านการนอนหลับ ผู้เขียน Why We Sleep ให้ข้อมูลที่พิสูจน์แล้วว่าการนอนหลับลึกส่งผลต่อสมองและสุขภาพองค์รวมอย่างไร",
            followers: "350K", following: "100", posts: "3K",
            profile_image: "https://unavatar.io/x/sleepdiplomat"
        },
        {
            name: "Mark Hyman",
            x_account: "drmarkhyman",
            reason: "แพทย์ผู้เชี่ยวชาญด้าน Functional Medicine เจาะลึกเรื่องระบบเผาผลาญ การใช้ \"อาหารเป็นยา\" และการแก้ปัญหาสุขภาพที่ต้นเหตุ",
            followers: "280K", following: "600", posts: "10K",
            profile_image: "https://unavatar.io/x/drmarkhyman"
        },
        {
            name: "Valter Longo",
            x_account: "proflongo",
            reason: "นักวิจัยระดับโลกด้านการอดอาหาร (Fasting Mimicking Diet) แชร์วิทยาศาสตร์การยืดอายุขัยผ่านการปรับเปลี่ยนโภชนาการ",
            followers: "80K", following: "50", posts: "1K",
            profile_image: "https://unavatar.io/x/proflongo"
        },
        {
            name: "Ben Greenfield",
            x_account: "bengreenfield",
            reason: "ผู้เชี่ยวชาญด้าน Biohacking และความฟิตระดับสุดยอด แชร์เทคนิคแปลกใหม่ในการแฮ็กสมรรถภาพร่างกาย การฟื้นฟู และการใช้เทคโนโลยีเพื่อสุขภาพ",
            followers: "120K", following: "1.2K", posts: "20K",
            profile_image: "https://unavatar.io/x/bengreenfield"
        },
        {
            name: "Layne Norton",
            x_account: "BioLayne",
            reason: "ด็อกเตอร์ด้านโภชนาการและนักเพาะกาย ใช้ข้อมูลวิทยาศาสตร์มาหักล้างความเชื่อผิดๆ (Debunk) เรื่องการลดน้ำหนักและการสร้างกล้ามเนื้อแบบตรงไปตรงมา",
            followers: "380K", following: "800", posts: "35K",
            profile_image: "https://unavatar.io/x/BioLayne"
        },
        {
            name: "Bryan Johnson",
            x_account: "bryan_johnson",
            reason: "เศรษฐีสาย Biohacker เจ้าของโปรเจกต์ Blueprint แชร์การทดลองใช้ดาต้าและเทคโนโลยีการแพทย์เพื่อย้อนวัยตัวเองให้กลับไปเป็นเด็กวัยรุ่น",
            followers: "450K", following: "1.5K", posts: "15K",
            profile_image: "https://unavatar.io/x/bryan_johnson"
        },
        {
            name: "Satchin Panda",
            x_account: "SatchinPanda",
            reason: "นักวิจัยแถวหน้าเรื่องนาฬิกาชีวภาพ (Circadian Rhythm) อธิบายความสำคัญของการกินอาหารให้ตรงเวลา (Time-restricted eating) เพื่อฟื้นฟูร่างกาย",
            followers: "110K", following: "300", posts: "2K",
            profile_image: "https://unavatar.io/x/SatchinPanda"
        },
        {
            name: "Paul Saladino",
            x_account: "paulsaladinomd",
            reason: "แพทย์ผู้นำเทรนด์ Animal-based diet และ Carnivore diet นำเสนอแง่มุมสุขภาพที่เน้นการกินเนื้อสัตว์และหลีกเลี่ยงสารพิษในพืช",
            followers: "320K", following: "1.2K", posts: "18K",
            profile_image: "https://unavatar.io/x/paulsaladinomd"
        },
        {
            name: "Shawn Stevenson",
            x_account: "ShawnModel",
            reason: "โฮสต์ Model Health Show สรุปทริคการดูแลสุขภาพ การกิน และการนอนหลับให้เข้าใจง่ายและปรับใช้ได้กับทุกคนในครอบครัว",
            followers: "150K", following: "1.1K", posts: "12K",
            profile_image: "https://unavatar.io/x/ShawnModel"
        },
        {
            name: "Max Lugavere",
            x_account: "maxlugavere",
            reason: "ผู้เขียน Genius Foods โฟกัสเรื่องโภชนาการที่ช่วยป้องกันโรคสมองเสื่อม การบำรุงระบบประสาท และการกินอาหารเพื่อสุขภาพจิตที่ดี",
            followers: "180K", following: "900", posts: "5K",
            profile_image: "https://unavatar.io/x/maxlugavere"
        },
        {
            name: "Ali Abdaal",
            x_account: "AliAbdaal",
            reason: "แพทย์และครีเอเตอร์สาย Productivity ที่เชื่อมโยงความสัมพันธ์ระหว่างการทำงานอย่างมีประสิทธิภาพกับการรักษาสุขภาพจิตเพื่อป้องกันภาวะ Burnout",
            followers: "3.5M", following: "1.8K", posts: "25K",
            profile_image: "https://unavatar.io/x/AliAbdaal"
        },
        {
            name: "Rich Roll",
            x_account: "richroll",
            reason: "นักกีฬาระดับอัลตร้าที่กินวีแกน (Plant-based) สัมภาษณ์ผู้เชี่ยวชาญระดับโลกเรื่องความแข็งแกร่งของจิตใจ การฟื้นฟู และการก้าวข้ามขีดจำกัดตัวเอง",
            followers: "420K", following: "1.2K", posts: "10K",
            profile_image: "https://unavatar.io/x/richroll"
        },
        {
            name: "Kelly Starrett",
            x_account: "thereadystate",
            reason: "นักกายภาพบำบัดระดับท็อป สอนเทคนิคเรื่อง Mobility การจัดระเบียบร่างกาย และการแก้ปวดเมื่อยจากออฟฟิศซินโดรมหรือการออกกำลังกาย",
            followers: "220K", following: "1.1K", posts: "8K",
            profile_image: "https://unavatar.io/x/thereadystate"
        },
        {
            name: "Thomas DeLauer",
            x_account: "ThomasDeLauer",
            reason: "ผู้เชี่ยวชาญด้านคีโตเจนิคไดเอท (Keto) และการทำ IF อธิบายกลไกทางวิทยาศาสตร์ที่ช่วยให้ร่างกายดึงไขมันมาใช้เป็นพลังงานได้ดีขึ้น",
            followers: "150K", following: "700", posts: "4K",
            profile_image: "https://unavatar.io/x/ThomasDeLauer"
        },
        {
            name: "Stephan Guyenet",
            x_account: "whsource",
            reason: "นักประสาทวิทยาที่ศึกษาเรื่องความอ้วน อธิบายสาเหตุที่สมองสั่งให้เราอยากอาหารขยะ และพฤติกรรมการกินของมนุษย์ยุคปัจจุบัน",
            followers: "50K", following: "200", posts: "500",
            profile_image: "https://unavatar.io/x/whsource"
        },
        {
            name: "Andy Galpin",
            x_account: "DrAndyGalpin",
            reason: "นักวิทยาศาสตร์การกีฬา เจาะลึกสรีรวิทยากล้ามเนื้อ สอนโปรแกรมการออกกำลังกายเพื่อเพิ่มความแข็งแรงและความทนทานแบบนักกีฬาระดับโลก",
            followers: "120K", following: "400", posts: "3K",
            profile_image: "https://unavatar.io/x/DrAndyGalpin"
        }
    ],
    lifestyle: [
        {
            name: "Tim Ferriss",
            x_account: "tferriss",
            reason: "ผู้เขียน The 4-Hour Workweek แชร์การทดลองไลฟ์สไตล์ (Lifestyle Design) การเพิ่มประสิทธิภาพชีวิต และแนวทางการทำงานให้น้อยแต่ได้มาก",
            followers: "1.8M", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/tferriss"
        },
        {
            name: "James Clear",
            x_account: "JamesClear",
            reason: "ผู้เขียน Atomic Habits โพสต์ข้อคิดสั้นๆ แต่ทรงพลังเกี่ยวกับการสร้างนิสัย การพัฒนากิจวัตรประจำวัน และการใช้ชีวิตอย่างมีระบบ",
            followers: "1.2M", following: "800", posts: "10K",
            profile_image: "https://unavatar.io/x/JamesClear"
        },
        {
            name: "Mark Manson",
            x_account: "IAmMarkManson",
            reason: "นักเขียนหนังสือแนวจิตวิทยาเสียดสีสังคม สอนศิลปะการปล่อยวาง การยอมรับความจริง และการเลิกแคร์สิ่งที่ไม่จำเป็นในชีวิต",
            followers: "450K", following: "400", posts: "15K",
            profile_image: "https://unavatar.io/x/IAmMarkManson"
        },
        {
            name: "Ryan Holiday",
            x_account: "RyanHoliday",
            reason: "ผู้นำปรัชญา Stoic มาประยุกต์ใช้กับชีวิตยุคใหม่ สอนวิธีควบคุมอารมณ์ รับมือกับอุปสรรค และการใช้ชีวิตอย่างสงบสุขท่ามกลางความวุ่นวาย",
            followers: "580K", following: "500", posts: "20K",
            profile_image: "https://unavatar.io/x/RyanHoliday"
        },
        {
            name: "Matt D'Avella",
            x_account: "mattdavella",
            reason: "ผู้สร้างภาพยนตร์สายมินิมอลลิสต์ แชร์เทคนิคการใช้ชีวิตแบบเรียบง่าย การเลิกเสพติดโซเชียล และการจัดระเบียบชีวิตให้มีความหมาย",
            followers: "150K", following: "600", posts: "5K",
            profile_image: "https://unavatar.io/x/mattdavella"
        },
        {
            name: "Colin Wright",
            x_account: "colinismyname",
            reason: "นักเดินทางรอบโลกเต็มตัว เล่าประสบการณ์การใช้ชีวิตแบบ Digital Nomad และปรัชญาความสุขที่ไม่ต้องพึ่งพาสิ่งของ",
            followers: "35K", following: "400", posts: "20K",
            profile_image: "https://unavatar.io/x/colinismyname"
        },
        {
            name: "Chris Guillebeau",
            x_account: "chrisguillebeau",
            reason: "นักเขียนผู้เดินทางไปทุกประเทศทั่วโลก แชร์ไอเดียการสร้างรายได้เสริม (Side Hustle) และการใช้ชีวิตแบบไม่ต้องเดินตามกรอบสังคม",
            followers: "120K", following: "800", posts: "15K",
            profile_image: "https://unavatar.io/x/chrisguillebeau"
        },
        {
            name: "Leo Babauta",
            x_account: "zen_habits",
            reason: "ผู้ก่อตั้ง Zen Habits สอนแนวทางการเจริญสติ การลดความซับซ้อนในชีวิต และการสร้างความสงบในจิตใจแบบค่อยเป็นค่อยไป",
            followers: "85K", following: "200", posts: "8K",
            profile_image: "https://unavatar.io/x/zen_habits"
        },
        {
            name: "Joshua Becker",
            x_account: "joshua_becker",
            reason: "ผู้นำแนวคิด Becoming Minimalist แชร์ทริคการจัดเก็บบ้าน การลด ละ เลิก สิ่งของ เพื่อโฟกัสกับครอบครัวและสิ่งที่สำคัญกว่า",
            followers: "110K", following: "300", posts: "25K",
            profile_image: "https://unavatar.io/x/joshua_becker"
        },
        {
            name: "Marie Kondo",
            x_account: "MarieKondo",
            reason: "ปรมาจารย์ด้านการจัดระเบียบชาวญี่ปุ่น นำเสนอวิธีการจัดบ้านแบบ KonMari ที่เน้นการเก็บเฉพาะสิ่งที่ \"Spark Joy\" เพื่อเปลี่ยนชีวิต",
            followers: "150K", following: "100", posts: "3K",
            profile_image: "https://unavatar.io/x/MarieKondo"
        },
        {
            name: "Courtney Carver",
            x_account: "bemorewithless",
            reason: "ผู้สร้างโปรเจกต์ 333 (แต่งตัวด้วยเสื้อผ้า 33 ชิ้น) สอนการสร้างแคปซูลวอร์โดรบ และมินิมอลลิสต์แบบผู้หญิงที่เน้นความสบายใจ",
            followers: "42K", following: "600", posts: "12K",
            profile_image: "https://unavatar.io/x/bemorewithless"
        },
        {
            name: "Tynan",
            x_account: "tynan",
            reason: "นักเขียนที่ใช้ชีวิตเร่ร่อน (Nomadic) แชร์ทริคการจัดกระเป๋าใบเดียวเดินทางทั่วโลก การใช้เงินอย่างคุ้มค่า และแพสชันเรื่องชา",
            followers: "28K", following: "300", posts: "10K",
            profile_image: "https://unavatar.io/x/tynan"
        },
        {
            name: "Rolf Potts",
            x_account: "rolfpotts",
            reason: "ผู้เขียน Vagabonding ตำนานของการเดินทางระยะยาว สอนปรัชญาว่าการเดินทางไม่ใช่เรื่องของคนรวย แต่เป็นเรื่องของการจัดสรรเวลา",
            followers: "32K", following: "200", posts: "5K",
            profile_image: "https://unavatar.io/x/rolfpotts"
        },
        {
            name: "Nomadic Matt",
            x_account: "nomadicmatt",
            reason: "กูรูด้านการท่องเที่ยวแบบประหยัด แชร์เทคนิคการจองตั๋ว/ที่พักราคาถูก และการวางแผนการใช้ชีวิตแบบ Digital Nomad ในต่างประเทศ",
            followers: "140K", following: "1.2K", posts: "30K",
            profile_image: "https://unavatar.io/x/nomadicmatt"
        },
        {
            name: "Johnny FD",
            x_account: "JohnnyFDK",
            reason: "นักธุรกิจออนไลน์ที่ทำงานจากที่ไหนก็ได้ในโลก แชร์เบื้องหลังรายได้ ค่าครองชีพในประเทศต่างๆ และอิสรภาพทางทำเลที่ตั้ง",
            followers: "15K", following: "200", posts: "8K",
            profile_image: "https://unavatar.io/x/JohnnyFDK"
        },
        {
            name: "Gretchen Rubin",
            x_account: "gretchenrubin",
            reason: "ผู้เชี่ยวชาญด้านความสุข (Happiness Project) วิเคราะห์ธรรมชาติของมนุษย์ และเทคนิคการสร้างนิสัยที่ทำให้ชีวิตมีความสุขขึ้นง่ายๆ",
            followers: "180K", following: "900", posts: "20K",
            profile_image: "https://unavatar.io/x/gretchenrubin"
        },
        {
            name: "Jay Shetty",
            x_account: "JayShettyIW",
            reason: "อดีตพระสงฆ์ที่กลายมาเป็นนักสร้างแรงบันาลใจ แชร์ข้อคิดเรื่องความสัมพันธ์ การมีสติ และการค้นหาเป้าหมายในชีวิตประจำวัน",
            followers: "400K", following: "500", posts: "15K",
            profile_image: "https://unavatar.io/x/JayShettyIW"
        },
        {
            name: "Yes Theory",
            x_account: "YesTheory",
            reason: "กลุ่มครีเอเตอร์สายผจญภัย นำเสนอไลฟ์สไตล์ \"Seek Discomfort\" ชวนคนก้าวออกจากคอมฟอร์ตโซนเพื่อพบประสบการณ์ชีวิตใหม่ๆ",
            followers: "250K", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/YesTheory"
        },
        {
            name: "Peter Shankman",
            x_account: "petershankman",
            reason: "ผู้ประกอบการที่เปลี่ยนสมาธิสั้น (ADHD) ให้เป็นพลัง แชร์ไลฟ์สไตล์การทำงาน การออกกำลังกาย และการเดินทางสำหรับผู้มีภาวะ Neurodivergent",
            followers: "110K", following: "1.1K", posts: "45K",
            profile_image: "https://unavatar.io/x/petershankman"
        }
    ],
    economy: [
        {
            name: "Paul Krugman",
            x_account: "paulkrugman",
            reason: "นักเศรษฐศาสตร์รางวัลโนเบล วิเคราะห์นโยบายเศรษฐกิจระดับมหภาค การค้าเสรี และผลกระทบของการเมืองต่อปากท้องประชาชน",
            followers: "4.5M", following: "450", posts: "20K",
            profile_image: "https://unavatar.io/x/paulkrugman"
        },
        {
            name: "Joseph Stiglitz",
            x_account: "JosephEStiglitz",
            reason: "นักเศรษฐศาสตร์รางวัลโนเบล วิจารณ์ความเหลื่อมล้ำทางเศรษฐกิจ โลกาภิวัตน์ และเสนอแนวทางเศรษฐกิจที่แคร์สังคมมากขึ้น",
            followers: "1.1M", following: "100", posts: "5K",
            profile_image: "https://unavatar.io/x/JosephEStiglitz"
        },
        {
            name: "Nouriel Roubini",
            x_account: "Nouriel",
            reason: "เจ้าของฉายา Dr. Doom นักเศรษฐศาสตร์ผู้คาดการณ์วิกฤตซับไพรม์ มักวิเคราะห์ความเสี่ยงเชิงระบบและสัญญาณฟองสบู่ในระบบเศรษฐกิจ",
            followers: "550K", following: "300", posts: "65K",
            profile_image: "https://unavatar.io/x/Nouriel"
        },
        {
            name: "Mohamed A. El-Erian",
            x_account: "elerianm",
            reason: "หัวหน้าที่ปรึกษาเศรษฐกิจ Allianz ทวีตบทวิเคราะห์ตลาดโลก ทิศทางนโยบายของธนาคารกลาง และผลกระทบของเงินเฟ้อที่อ่านง่ายและกระชับ",
            followers: "650K", following: "1.2K", posts: "15K",
            profile_image: "https://unavatar.io/x/elerianm"
        },
        {
            name: "David Rosenberg",
            x_account: "DavidRosenbergEX",
            reason: "นักวิเคราะห์เศรษฐกิจแถวหน้า มักให้มุมมองเชิงลึกที่ขัดแย้งกับกระแสหลัก (Contrarian) เจาะลึกตัวเลขเศรษฐกิจเพื่อหาโอกาส/ความเสี่ยงที่ซ่อนอยู่",
            followers: "120K", following: "400", posts: "25K",
            profile_image: "https://unavatar.io/x/DavidRosenbergEX"
        },
        {
            name: "Steve Hanke",
            x_account: "steve_hanke",
            reason: "ผู้เชี่ยวชาญด้านเงินเฟ้อขั้นรุนแรง (Hyperinflation) วิจารณ์นโยบายการเงินของประเทศต่างๆ ด้วยข้อมูลดัชนีเศรษฐกิจแบบเรียลไทม์",
            followers: "750K", following: "50", posts: "50K",
            profile_image: "https://unavatar.io/x/steve_hanke"
        },
        {
            name: "Richard Thaler",
            x_account: "R_Thaler",
            reason: "ผู้บิดาแห่งเศรษฐศาสตร์พฤติกรรม (รางวัลโนเบล) นำเสนอแนวคิด Nudge อธิบายว่าทำไมมนุษย์ถึงตัดสินใจเรื่องเงินอย่างไม่เป็นเหตุเป็นผล",
            followers: "280K", following: "50", posts: "2K",
            profile_image: "https://unavatar.io/x/R_Thaler"
        },
        {
            name: "Tyler Cowen",
            x_account: "tylercowen",
            reason: "นักเศรษฐศาสตร์ผู้ร่วมก่อตั้ง Marginal Revolution รีวิวหนังสือ วิเคราะห์นวัตกรรม และแชร์มุมมองเศรษฐกิจที่กว้างไกลและลึกซึ้ง",
            followers: "220K", following: "800", posts: "45K",
            profile_image: "https://unavatar.io/x/tylercowen"
        },
        {
            name: "Robin Wigglesworth",
            x_account: "RobinWigg",
            reason: "นักข่าวจาก Financial Times เล่าเรื่องราวประวัติศาสตร์ของตลาดการเงิน กองทุนดัชนี และโครงสร้างของวอลล์สตรีทแบบอ่านสนุก",
            followers: "85K", following: "1.2K", posts: "30K",
            profile_image: "https://unavatar.io/x/RobinWigg"
        },
        {
            name: "Joe Weisenthal",
            x_account: "TheStalwart",
            reason: "โฮสต์รายการ Odd Lots จาก Bloomberg เจาะลึกกลไกทางเศรษฐกิจที่ซับซ้อน (เช่น ห่วงโซ่อุปทาน, พลังงาน) ให้กลายเป็นเรื่องเข้าใจง่าย",
            followers: "350K", following: "1.5K", posts: "120K",
            profile_image: "https://unavatar.io/x/TheStalwart"
        },
        {
            name: "Tracy Alloway",
            x_account: "tracyalloway",
            reason: "นักข่าวการเงินจาก Bloomberg โพสต์อินไซต์ตลาดทุน ปรากฏการณ์ทางเศรษฐกิจแปลกๆ และมีมเศรษฐศาสตร์ที่สะท้อนภาพตลาดได้ดี",
            followers: "280K", following: "1.2K", posts: "40K",
            profile_image: "https://unavatar.io/x/tracyalloway"
        },
        {
            name: "Stephanie Kelton",
            x_account: "StephanieKelton",
            reason: "ผู้นำแนวคิด Modern Monetary Theory (MMT) อธิบายเรื่องหนี้สาธารณะ นโยบายขาดดุลของรัฐ และการใช้จ่ายเพื่อกระตุ้นเศรษฐกิจ",
            followers: "180K", following: "600", posts: "15K",
            profile_image: "https://unavatar.io/x/StephanieKelton"
        },
        {
            name: "Adam Tooze",
            x_account: "adam_tooze",
            reason: "นักประวัติศาสตร์เศรษฐกิจ วิเคราะห์วิกฤตเศรษฐกิจโลก (Polycrisis) ความสัมพันธ์ระหว่างภูมิรัฐศาสตร์ การเปลี่ยนแปลงสภาพภูมิอากาศ และระบบการเงิน",
            followers: "250K", following: "900", posts: "35K",
            profile_image: "https://unavatar.io/x/adam_tooze"
        },
        {
            name: "Jason Furman",
            x_account: "jasonfurman",
            reason: "อดีตประธานที่ปรึกษาเศรษฐกิจสหรัฐฯ ทวีตข้อมูลและกราฟวิเคราะห์แนวโน้มเงินเฟ้อ ตลาดแรงงาน และนโยบายรัฐบาลอย่างมีเหตุผล",
            followers: "140K", following: "400", posts: "20K",
            profile_image: "https://unavatar.io/x/jasonfurman"
        },
        {
            name: "Justin Wolfers",
            x_account: "JustinWolfers",
            reason: "นักเศรษฐศาสตร์ที่นำข้อมูล Data มาอธิบายเทรนด์ตลาดแรงงาน นโยบายสาธารณะ และสถิติที่กระทบต่อชีวิตประจำวัน",
            followers: "110K", following: "900", posts: "30K",
            profile_image: "https://unavatar.io/x/JustinWolfers"
        },
        {
            name: "Austan Goolsbee",
            x_account: "Austan_Goolsbee",
            reason: "ประธาน Fed สาขาชิคาโก อธิบายหลักการเศรษฐศาสตร์ นโยบายการเงิน และกลไกของธนาคารกลางด้วยภาษาที่คนทั่วไปเข้าถึงได้",
            followers: "90K", following: "300", posts: "8K",
            profile_image: "https://unavatar.io/x/Austan_Goolsbee"
        },
        {
            name: "Claudia Sahm",
            x_account: "Claudia_Sahm",
            reason: "ผู้คิดค้นกฎ Sahm Rule (ตัวชี้วัดสภาวะถดถอย) วิเคราะห์เศรษฐกิจจุลภาค ผลกระทบของเงินเฟ้อที่มีต่อผู้บริโภคระดับรากหญ้า",
            followers: "75K", following: "1.2K", posts: "25K",
            profile_image: "https://unavatar.io/x/Claudia_Sahm"
        },
        {
            name: "Mark Cuban",
            x_account: "mcuban",
            reason: "มหาเศรษฐีที่ให้มุมมองเศรษฐกิจผ่านเลนส์ของนักธุรกิจ วิจารณ์ระบบประกันสุขภาพ นโยบายภาษี และการสร้างโอกาสให้คนรุ่นใหม่",
            followers: "8.8M", following: "2.5K", posts: "50K",
            profile_image: "https://unavatar.io/x/mcuban"
        },
        {
            name: "Mariana Mazzucato",
            x_account: "MazzucatoM",
            reason: "นักเศรษฐศาสตร์สายกระตุ้นนวัตกรรม นำเสนอความสำคัญของรัฐในการลงทุนวิจัย และการปรับโครงสร้างระบบทุนนิยมให้ยุติธรรมขึ้น",
            followers: "150K", following: "1.1K", posts: "12K",
            profile_image: "https://unavatar.io/x/MazzucatoM"
        },
        {
            name: "Jim Bianco",
            x_account: "biancoresearch",
            reason: "นักวิเคราะห์การเงินที่เก่งเรื่องการใช้ Data วิเคราะห์ตลาดตราสารหนี้ ทิศทางดอกเบี้ยของ Fed และเทรนด์เศรษฐกิจดิจิทัล",
            followers: "320K", following: "900", posts: "40K",
            profile_image: "https://unavatar.io/x/biancoresearch"
        }
    ],
    politics: [
        {
            name: "Barack Obama",
            x_account: "BarackObama",
            reason: "อดีตประธานาธิบดีสหรัฐฯ โพสต์ข้อคิดเกี่ยวกับการเมืองโลก ปัญหาสังคม สิทธิมนุษยชน และหนังสือ/เพลงที่สะท้อนวัฒนธรรมแห่งยุคสมัย",
            followers: "131M", following: "550K", posts: "16K",
            profile_image: "https://unavatar.io/x/BarackObama"
        },
        {
            name: "Alexandria Ocasio-Cortez",
            x_account: "AOC",
            reason: "นักการเมืองหญิงรุ่นใหม่ของสหรัฐฯ กระบอกเสียงสำคัญเรื่องสิทธิแรงงาน ความยุติธรรมทางสังคม และนโยบายแก้ปัญหา Climate Change",
            followers: "13M", following: "3.5K", posts: "14K",
            profile_image: "https://unavatar.io/x/AOC"
        },
        {
            name: "Bernie Sanders",
            x_account: "SenSanders",
            reason: "วุฒิสมาชิกสหรัฐฯ ผู้นำแนวคิดสังคมนิยมประชาธิปไตย ทวีตโจมตีความเหลื่อมล้ำทางเศรษฐกิจ ทุนผูกขาด และสิทธิการรักษาพยาบาล",
            followers: "15M", following: "1.2K", posts: "20K",
            profile_image: "https://unavatar.io/x/SenSanders"
        },
        {
            name: "Emmanuel Macron",
            x_account: "EmmanuelMacron",
            reason: "ประธานาธิบดีฝรั่งเศส อัปเดตความเคลื่อนไหวทางภูมิรัฐศาสตร์ของสหภาพยุโรป (EU) และทิศทางนโยบายต่างประเทศระดับโลก",
            followers: "9.5M", following: "800", posts: "12K",
            profile_image: "https://unavatar.io/x/EmmanuelMacron"
        },
        {
            name: "Ian Bremmer",
            x_account: "ianbremmer",
            reason: "ผู้ก่อตั้ง Eurasia Group นักวิเคราะห์ความเสี่ยงระดับโลก โพสต์สรุปสถานการณ์ความขัดแย้งระหว่างประเทศ และภาพรวมภูมิรัฐศาสตร์ประจำวัน",
            followers: "850K", following: "1.5K", posts: "45K",
            profile_image: "https://unavatar.io/x/ianbremmer"
        },
        {
            name: "Richard Dawkins",
            x_account: "RichardDawkins",
            reason: "นักชีววิทยาวิวัฒนาการ โพสต์ข้อคิดกระตุกต่อมสังคมเกี่ยวกับวิทยาศาสตร์ การใช้เหตุผล และวิจารณ์ความเชื่อ/ศาสนาอย่างตรงไปตรงมา",
            followers: "2.9M", following: "1.2K", posts: "30K",
            profile_image: "https://unavatar.io/x/RichardDawkins"
        },
        {
            name: "Yuval Noah Harari",
            x_account: "harari_yuval",
            reason: "นักประวัติศาสตร์ชื่อดัง วิเคราะห์ทิศทางสังคมมนุษย์ในอนาคต ผลกระทบของ AI ต่อตลาดแรงงาน และการอยู่รอดของเผ่าพันธุ์พันธุ์มนุษย์",
            followers: "750K", following: "100", posts: "5K",
            profile_image: "https://unavatar.io/x/harari_yuval"
        },
        {
            name: "Slavoj Žižek",
            x_account: "SlavojZizek",
            reason: "นักปรัชญาแนวมาร์กซิสต์ วิจารณ์ทุนนิยม วัฒนธรรมป๊อป และปรากฏการณ์ทางสังคมด้วยมุมมองเชิงจิตวิเคราะห์ที่คาดไม่ถึง",
            followers: "120K", following: "10", posts: "1K",
            profile_image: "https://unavatar.io/x/SlavojZizek"
        },
        {
            name: "Jordan Peterson",
            x_account: "jordanbpeterson",
            reason: "นักจิตวิทยาคลินิก ตัวแทนความคิดอนุรักษ์นิยม ทวีตเกี่ยวกับเสรีภาพในการพูด ความรับผิดชอบต่อตัวเอง และวิจารณ์กระแส Woke ในสังคม",
            followers: "5.2M", following: "2.5K", posts: "40K",
            profile_image: "https://unavatar.io/x/jordanbpeterson"
        },
        {
            name: "Malala Yousafzai",
            x_account: "Malala",
            reason: "เจ้าของรางวัลโนเบลสาขาสันติภาพ นักขับเคลื่อนด้านสิทธิมนุษยชน รณรงค์เรื่องการศึกษาของเด็กผู้หญิงและความเท่าเทียมในประเทศโลกที่สาม",
            followers: "1.8M", following: "1.1K", posts: "8K",
            profile_image: "https://unavatar.io/x/Malala"
        },
        {
            name: "Greta Thunberg",
            x_account: "GretaThunberg",
            reason: "นักเคลื่อนไหวด้านสิ่งแวดล้อมวัยรุ่น โพสต์กดดันผู้นำโลกเรื่องวิกฤตสภาพภูมิอากาศ และรายงานสถานการณ์ประท้วงของคนรุ่นใหม่ทั่วโลก",
            followers: "4.8M", following: "1.2K", posts: "15K",
            profile_image: "https://unavatar.io/x/GretaThunberg"
        },
        {
            name: "Nate Silver",
            x_account: "NateSilver538",
            reason: "นักสถิติผู้เชี่ยวชาญการพยากรณ์ผลการเลือกตั้ง วิเคราะห์โพลการเมืองสหรัฐฯ ด้วย Data และมุมมองทางคณิตศาสตร์แบบเป็นกลาง",
            followers: "3.5M", following: "1.5K", posts: "60K",
            profile_image: "https://unavatar.io/x/NateSilver538"
        },
        {
            name: "Ezra Klein",
            x_account: "ezraklein",
            reason: "คอลัมนิสต์จาก NYT วิเคราะห์โครงสร้างนโยบายรัฐ สาเหตุของความแตกแยกทางการเมือง (Polarization) และสัมภาษณ์นักคิดระดับโลก",
            followers: "2.6M", following: "1.8K", posts: "35K",
            profile_image: "https://unavatar.io/x/ezraklein"
        },
        {
            name: "Dan Pfeiffer",
            x_account: "danpfeiffer",
            reason: "โฮสต์พอดแคสต์ Pod Save America วิเคราะห์ยุทธศาสตร์การเมือง การสื่อสารของพรรคเดโมแครต และการทำงานของสื่อมวลชน",
            followers: "750K", following: "2.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/danpfeiffer"
        },
        {
            name: "Ben Shapiro",
            x_account: "benshapiro",
            reason: "สื่อมวลชนฝ่ายขวา วิเคราะห์ข่าวการเมืองรายวัน โต้แย้งนโยบายฝ่ายซ้าย และพูดถึงประเด็นสงครามวัฒนธรรม (Culture War) อย่างเผ็ดร้อน",
            followers: "6.5M", following: "1.2K", posts: "50K",
            profile_image: "https://unavatar.io/x/benshapiro"
        },
        {
            name: "Tucker Carlson",
            x_account: "TuckerCarlson",
            reason: "สื่อมวลชนอิสระสายอนุรักษ์นิยม สัมภาษณ์บุคคลที่เป็นที่ถกเถียง และวิจารณ์โครงสร้างอำนาจของรัฐบาลตะวันตกด้วยมุมมองที่ดุดัน",
            followers: "12M", following: "100", posts: "15K",
            profile_image: "https://unavatar.io/x/TuckerCarlson"
        },
        {
            name: "Glenn Greenwald",
            x_account: "ggreenwald",
            reason: "นักข่าวสืบสวนอิสระ วิจารณ์การละเมิดสิทธิมนุษยชน เสรีภาพสื่อ และการแทรกแซงของรัฐบาล/หน่วยงานข่าวกรองในการเมืองระดับโลก",
            followers: "2.1M", following: "2.5K", posts: "85K",
            profile_image: "https://unavatar.io/x/ggreenwald"
        },
        {
            name: "Robert Reich",
            x_account: "RBReich",
            reason: "อดีตรัฐมนตรีกระทรวงแรงงานสหรัฐฯ ทวีตข้อมูลตีแผ่ความโลภขององค์กรขนาดใหญ่ (Corporate Greed) และปกป้องสิทธิสหภาพแรงงาน",
            followers: "1.5M", following: "800", posts: "30K",
            profile_image: "https://unavatar.io/x/RBReich"
        },
        {
            name: "Fareed Zakaria",
            x_account: "FareedZakaria",
            reason: "นักวิเคราะห์นโยบายต่างประเทศจาก CNN ให้มุมมองเชิงลึกเกี่ยวกับการแข่งขันระดับมหาอำนาจ ประวัติศาสตร์ และการทูตระหว่างประเทศ",
            followers: "1.2M", following: "450", posts: "12K",
            profile_image: "https://unavatar.io/x/FareedZakaria"
        },
        {
            name: "Anne Applebaum",
            x_account: "anneapplebaum",
            reason: "นักประวัติศาสตร์รางวัลพูลิตเซอร์ เชี่ยวชาญด้านยุโรปตะวันออก วิเคราะห์ภัยคุกคามจากระบอบเผด็จการ และการล่มสลายของประชาธิปไตย",
            followers: "750K", following: "1.5K", posts: "25K",
            profile_image: "https://unavatar.io/x/anneapplebaum"
        }
    ],
    self_dev: [
        {
            name: "Simon Sinek",
            x_account: "simonsinek",
            reason: "ผู้แต่ง Start With Why ทวีตข้อคิดด้านการเป็นผู้นำที่ใส่ใจลูกน้อง การทำงานเป็นทีม และการค้นหาเป้าหมาย (Purpose) ในการทำงาน",
            followers: "950K", following: "450", posts: "12K",
            profile_image: "https://unavatar.io/x/simonsinek"
        },
        {
            name: "Adam Grant",
            x_account: "AdamMGrant",
            reason: "นักจิตวิทยาองค์กรจาก Wharton สอนการทลายความเชื่อเดิมๆ (Think Again) การให้ฟีดแบ็ก และการสร้างวัฒนธรรมองค์กรที่ดี",
            followers: "850K", following: "550", posts: "10K",
            profile_image: "https://unavatar.io/x/AdamMGrant"
        },
        {
            name: "Brené Brown",
            x_account: "BreneBrown",
            reason: "นักวิจัยระดับโลก โพสต์เกี่ยวกับพลังของความเปราะบาง (Vulnerability) ความกล้าหาญ และการเป็นผู้นำที่มีความเห็นอกเห็นใจ",
            followers: "1.1M", following: "600", posts: "8K",
            profile_image: "https://unavatar.io/x/BreneBrown"
        },
        {
            name: "Carol Dweck",
            x_account: "MindsetWorks",
            reason: "ผู้นำแนวคิด Growth Mindset (ผ่านองค์กรของเธอ) แชร์วิธีปลูกฝังกรอบความคิดแบบเติบโตให้เด็กและวัยทำงานเพื่อรับมือกับความล้มเหลว",
            followers: "120K", following: "300", posts: "5K",
            profile_image: "https://unavatar.io/x/MindsetWorks"
        },
        {
            name: "Angela Duckworth",
            x_account: "angeladuckw",
            reason: "นักจิตวิทยาผู้เขียน Grit สอนเรื่องความทรหดอดทน แพสชัน และเคล็ดลับทางจิตวิทยาที่ทำให้คนประสบความสำเร็จระยะยาว",
            followers: "180K", following: "400", posts: "6K",
            profile_image: "https://unavatar.io/x/angeladuckw"
        },
        {
            name: "Susan Cain",
            x_account: "susancain",
            reason: "ผู้แต่ง Quiet สนับสนุนพลังของคน Introvert สอนให้สังคมเห็นคุณค่าของความเงียบ และการเป็นผู้นำในสไตล์ที่ไม่ต้องตะโกน",
            followers: "220K", following: "500", posts: "12K",
            profile_image: "https://unavatar.io/x/susancain"
        },
        {
            name: "Dan Pink",
            x_account: "DanielPink",
            reason: "นักเขียนแนวจิตวิทยาธุรกิจ แชร์เทคนิคเพิ่มแรงจูงใจ (Motivation) ในการทำงาน ศิลปะการขาย และการบริหารเวลาอย่างมีประสิทธิภาพ",
            followers: "150K", following: "600", posts: "15K",
            profile_image: "https://unavatar.io/x/DanielPink"
        },
        {
            name: "Sal Khan",
            x_account: "salkhanacademy",
            reason: "ผู้ก่อตั้ง Khan Academy อัปเดตเทรนด์การศึกษาแห่งอนาคต การใช้ AI เป็นติวเตอร์ส่วนตัว (Khanmigo) เพื่อลดความเหลื่อมล้ำทางการศึกษา",
            followers: "280K", following: "400", posts: "8K",
            profile_image: "https://unavatar.io/x/salkhanacademy"
        },
        {
            name: "Seth Godin",
            x_account: "ThisIsSethsBlog",
            reason: "ปรมาจารย์ด้าน AltMBA สอนปรัชญาการเรียนรู้ตลอดชีวิต การก้าวข้ามความกลัวเพื่อสร้างสรรค์ผลงาน และการส่งมอบงานคุณภาพสู่สังคม",
            followers: "780K", following: "100", posts: "20K",
            profile_image: "https://unavatar.io/x/ThisIsSethsBlog"
        },
        {
            name: "Shane Parrish",
            x_account: "ShaneAParrish",
            reason: "ผู้ก่อตั้ง Farnam Street แชร์ Framework การตัดสินใจ \"Mental Models\" เพื่อพัฒนาทักษะการคิดเชิงวิพากษ์สำหรับผู้บริหาร",
            followers: "420K", following: "900", posts: "30K",
            profile_image: "https://unavatar.io/x/ShaneAParrish"
        },
        {
            name: "David Perell",
            x_account: "david_perell",
            reason: "ผู้เชี่ยวชาญด้านการเขียนบนอินเทอร์เน็ต สอนทักษะ Write of Passage การใช้การเขียนเพื่อจัดระบบความคิดและสร้างโอกาสในสายอาชีพ",
            followers: "380K", following: "1.2K", posts: "25K",
            profile_image: "https://unavatar.io/x/david_perell"
        },
        {
            name: "Tiago Forte",
            x_account: "fortelabs",
            reason: "ผู้สร้างแนวคิด Building a Second Brain สอนระบบจัดการความรู้ส่วนบุคคล (PKM) และการใช้แอปจดบันทึกเพื่อเพิ่มประสิทธิภาพสมอง",
            followers: "150K", following: "800", posts: "15K",
            profile_image: "https://unavatar.io/x/fortelabs"
        },
        {
            name: "Justin Welsh",
            x_account: "thejustinwelsh",
            reason: "สายสอนธุรกิจ One-Person Business ทวีตแนะนำแหล่งเรียนรู้ฟรี เครื่องมือ AI และวิธีการสร้างแบรนด์ตัวตนเพื่อความก้าวหน้า",
            followers: "450K", following: "1.1K", posts: "12K",
            profile_image: "https://unavatar.io/x/thejustinwelsh"
        },
        {
            name: "Eric Barker",
            x_account: "bakadesuyo",
            reason: "นักเขียนแนวพัฒนาตัวเองที่อิงวิทยาศาสตร์ (Science-backed) สรุปงานวิจัยเรื่องความสำเร็จ ความสุข และความสัมพันธ์ด้วยภาษาที่อ่านสนุก",
            followers: "85K", following: "600", posts: "10K",
            profile_image: "https://unavatar.io/x/bakadesuyo"
        },
        {
            name: "Cal Newport",
            x_account: "calnewport",
            reason: "ศาสตราจารย์และผู้แต่ง Deep Work สอนเทคนิคการเรียน/ทำงานแบบจดจ่อ การจัดตารางเวลา และกฎการประสบความสำเร็จในยุคที่เต็มไปด้วยสิ่งเร้า",
            followers: "50K", following: "10", posts: "1K",
            profile_image: "https://unavatar.io/x/calnewport"
        },
        {
            name: "Mel Robbins",
            x_account: "melrobbins",
            reason: "นักพูดสร้างแรงบันดาลใจ เจ้าของกฎ 5 วินาที (The 5 Second Rule) ให้คำแนะนำที่ลงมือทำได้ทันทีเพื่อแก้อาการผัดวันประกันพรุ่ง",
            followers: "1.5M", following: "1.2K", posts: "20K",
            profile_image: "https://unavatar.io/x/melrobbins"
        },
        {
            name: "Robin Sharma",
            x_account: "RobinSharma",
            reason: "ผู้แต่ง The 5 AM Club แชร์ปรัชญาการตื่นเช้าเพื่อพัฒนาตัวเอง การสร้างกิจวัตรของผู้ชนะ และการเป็นผู้นำชีวิตตัวเอง",
            followers: "650K", following: "500", posts: "15K",
            profile_image: "https://unavatar.io/x/RobinSharma"
        },
        {
            name: "Marie Forleo",
            x_account: "marieforleo",
            reason: "ผู้สร้างคอร์ส B-School นำเสนอพลังบวกและคำแนะนำเชิงปฏิบัติสำหรับการพัฒนาตัวเองควบคู่ไปกับการทำตามความฝัน",
            followers: "220K", following: "1.1K", posts: "8K",
            profile_image: "https://unavatar.io/x/marieforleo"
        },
        {
            name: "John Green",
            x_account: "johngreen",
            reason: "นักเขียนและผู้สร้างช่อง Crash Course โพสต์มุมมองการศึกษานอกห้องเรียนที่สนุกสนาน การเปิดรับความรู้รอบตัว และความเห็นอกเห็นใจต่อเพื่อนมนุษย์",
            followers: "4.8M", following: "1.5K", posts: "20K",
            profile_image: "https://unavatar.io/x/johngreen"
        }
    ],
    ai: [
        {
            name: "Andrej Karpathy",
            x_account: "karpathy",
            reason: "อดีตหัวหน้า AI ที่ Tesla และทีมก่อตั้ง OpenAI ผู้เชี่ยวชาญการ train โมเดลภาษาใหญ่แบบ practical จริงจัง tutorial โค้ด เทคนิค train LLM ใหม่ ๆ และทดลองกับ nanochat/agent แบบ hands-on",
            followers: "1.1M", following: "900", posts: "12K",
            profile_image: "https://unavatar.io/x/karpathy"
        },
        {
            name: "Lex Fridman",
            x_account: "lexfridman",
            reason: "โฮสต์พอดแคสต์ Lex Fridman Podcast ที่สัมภาษณ์นักวิทยาศาสตร์ AI และคนดังระดับโลก คลิปสนทนาลึก ๆ เกี่ยวกับ AI วิทยาศาสตร์ ปรัชญา และชีวิตมนุษย์",
            followers: "3.2M", following: "1.2K", posts: "15K",
            profile_image: "https://unavatar.io/x/lexfridman"
        },
        {
            name: "Sam Altman",
            x_account: "sama",
            reason: "CEO OpenAI ผู้กำหนดทิศทาง ChatGPT และโมเดลใหญ่ ๆ อัพเดตข่าวภายใน OpenAI มุมมอง AGI การพัฒนา AI และหลักการ alignment/ประชาธิปไตย",
            followers: "2.5M", following: "800", posts: "8K",
            profile_image: "https://unavatar.io/x/sama"
        },
        {
            name: "Yann LeCun",
            x_account: "ylecun",
            reason: "Chief AI Scientist Meta และผู้บุกเบิก Deep Learning (รางวัล Turing Award) วิจารณ์ AI ตรง ๆ มุมมองอนาคตวิจัยลึก และโต้แจ้งไอเดียคนอื่นในวงการ",
            followers: "700K", following: "600", posts: "10K",
            profile_image: "https://unavatar.io/x/ylecun"
        },
        {
            name: "Andrew Ng",
            x_account: "AndrewYNg",
            reason: "ผู้ก่อตั้ง Coursera และ Landing AI ผู้สอน AI ให้คนนับล้านทั่วโลก คอร์สเรียนใหม่ ๆ เคล็ดลับเรียน AI นำไปใช้ธุรกิจ และตัวอย่างชีวิตจริงกับ AI",
            followers: "900K", following: "500", posts: "5K",
            profile_image: "https://unavatar.io/x/AndrewYNg"
        },
        {
            name: "Fei-Fei Li",
            x_account: "drfeifei",
            reason: "ศาสตราจารย์ Stanford ผู้บุกเบิก ImageNet และ Human-Centered AI AI ที่เน้นมนุษย์เป็นศูนย์กลาง จริยธรรม spatial intelligence และวิจัยภาพ",
            followers: "400K", following: "400", posts: "3K",
            profile_image: "https://unavatar.io/x/drfeifei"
        },
        {
            name: "Demis Hassabis",
            x_account: "demishassabis",
            reason: "ผู้ก่อตั้ง DeepMind ผู้ได้รับ Nobel 2024 และพัฒนา AlphaFold/AlphaGo ความก้าวหน้า AI research ขั้นสูง โมเดลใหม่ และการแก้ปัญหายาก ๆ ในวิทยาศาสตร์",
            followers: "300K", following: "300", posts: "2K",
            profile_image: "https://unavatar.io/x/demishassabis"
        },
        {
            name: "Greg Brockman",
            x_account: "gdb",
            reason: "Co-founder OpenAI ผู้พัฒนาโครงสร้างพื้นฐาน ChatGPT อัพเดตเทคนิคภายใน โมเดลใหม่ และการ scaling AI แบบ practical",
            followers: "500K", following: "400", posts: "6K",
            profile_image: "https://unavatar.io/x/gdb"
        },
        {
            name: "Ilya Sutskever",
            x_account: "ilyasut",
            reason: "CEO ของ Safe Superintelligence Inc. (SSI) และอดีต Chief Scientist OpenAI ผู้คิดค้น Transformer มุ่งเน้นการสร้าง AI ที่ปลอดภัยและมีประสิทธิภาพสูงสุด (Safe Superintelligence) พร้อมมุมมองวิจัยเชิงลึก",
            followers: "600K", following: "200", posts: "1K",
            profile_image: "https://unavatar.io/x/ilyasut"
        },
        {
            name: "John Carmack",
            x_account: "ID_AA_Carmack",
            reason: "ตำนานเกม Doom + ผู้พัฒนา AI Robotics ที่ Keen Technologies มุมมองตรง ๆ เกี่ยวกับ AI practical robotics และเทคนิคโปรแกรมมิ่ง",
            followers: "1.2M", following: "300", posts: "20K",
            profile_image: "https://unavatar.io/x/ID_AA_Carmack"
        },
        {
            name: "Rowan Cheung",
            x_account: "rowancheung",
            reason: "ผู้ก่อตั้ง The Rundown AI สื่อสรุปข่าว AI ชั้นนำ สรุปข่าว AI ล่าสุดแบบสั้นกระชับทุกวัน ให้คนตามทันเร็ว",
            followers: "450K", following: "1.1K", posts: "15K",
            profile_image: "https://unavatar.io/x/rowancheung"
        },
        {
            name: "Kai-Fu Lee",
            x_account: "kaifulee",
            reason: "อดีต President Google China ผู้เชี่ยวชาญ AI เอเชียและเขียนหนังสือ AI Superpowers มุมมอง AI ในธุรกิจจริง การแข่งขันจีน-สหรัฐ และอนาคต AI ระดับโลก",
            followers: "1.5M", following: "500", posts: "4K",
            profile_image: "https://unavatar.io/x/kaifulee"
        },
        {
            name: "François Chollet",
            x_account: "fchollet",
            reason: "ผู้สร้าง Keras และผู้ก่อตั้ง Ndea (AI Lab ใหม่) วิเคราะห์ลึกเรื่อง AI intelligence benchmark (ARC-AGI) และการก้าวไปสู่ AGI ด้วยแนวคิดใหม่ๆ ที่นอกเหนือจาก LLM",
            followers: "400K", following: "500", posts: "7K",
            profile_image: "https://unavatar.io/x/fchollet"
        },
        {
            name: "Allie K. Miller",
            x_account: "alliekmiller",
            reason: "AI Business Strategy Expert ที่ปรึกษา Fortune 500 วิธีนำ AI ไปใช้ในองค์กร case study ธุรกิจ และเทรนด์ AI สำหรับ CEO",
            followers: "200K", following: "800", posts: "5K",
            profile_image: "https://unavatar.io/x/alliekmiller"
        },
        {
            name: "Matt Shumer",
            x_account: "mattshumer_",
            reason: "CEO OthersideAI และผู้ก่อตั้ง Shumer Capital ผู้นำทางความคิดด้าน AI Agents และการประยุกต์ใช้ AI ในธุรกิจยุคใหม่ พร้อมสาธิตเครื่องมือล้ำสมัยรายวัน",
            followers: "150K", following: "600", posts: "8K",
            profile_image: "https://unavatar.io/x/mattshumer_"
        },
        {
            name: "Logan Kilpatrick",
            x_account: "OfficialLoganK",
            reason: "Product Lead ที่ Google DeepMind (ดูแล Google AI Studio และ Gemini API) อัปเดตเทคโนโลยี Gemini สำหรับนักพัฒนา และทิศทาง Ecosystem ของ Google AI",
            followers: "100K", following: "1.2K", posts: "6K",
            profile_image: "https://unavatar.io/x/OfficialLoganK"
        },
        {
            name: "Aravind Srinivas",
            x_account: "AravSrinivas",
            reason: "CEO Perplexity AI ผู้เปลี่ยนวงการ search ด้วย AI อัพเดตผลิตภัณฑ์ AI search ใหม่ ๆ และมุมมองการแข่งขันกับ Google",
            followers: "180K", following: "400", posts: "3K",
            profile_image: "https://unavatar.io/x/AravSrinivas"
        },
        {
            name: "Jim Fan",
            x_account: "DrJimFan",
            reason: "ผู้นำ NVIDIA Robotics ผู้พัฒนา GR00T และ embodied AI งานวิจัยหุ่นยนต์ AI ในโลกจริง scaling law และ humanoid robot",
            followers: "250K", following: "500", posts: "4K",
            profile_image: "https://unavatar.io/x/DrJimFan"
        },
        {
            name: "Riley Goodside",
            x_account: "goodside",
            reason: "Staff Prompt Engineer ที่ Scale AI (อดีต Google DeepMind) ปรมาจารย์ด้าน Prompt Engineering ระดับโลก แชร์เทคนิคการรีดประสิทธิภาพสูงสุดจากโมเดลภาษาขนาดใหญ่",
            followers: "120K", following: "300", posts: "2K",
            profile_image: "https://unavatar.io/x/goodside"
        },
        {
            name: "Elon Musk",
            x_account: "elonmusk",
            reason: "ผู้ก่อตั้ง xAI และผู้ผลักดัน AI ทั่วโลก Credibility สูงจากบริษัทเทคโนโลยีชั้นนำ มุมมอง AGI Grok xAI และอนาคตมนุษย์กับ AI",
            followers: "210M", following: "600", posts: "50K",
            profile_image: "https://unavatar.io/x/elonmusk"
        }
    ]
};