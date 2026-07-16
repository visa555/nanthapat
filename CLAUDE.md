# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานกับโค้ดในโปรเจกต์นี้

## ภาพรวมโปรเจกต์

นี่คือเว็บไซต์พอร์ตโฟลิโอส่วนตัว ("Nanthapat") แบบ static ไม่มีขั้นตอน build โดยต่อยอดจากเทมเพลต **Jesper - Creative Portfolio Showcase HTML Website Template** (Themetorium) ไม่มี bundler, package manager หรือ framework ใดๆ — `index.html` ถูกเสิร์ฟตรงๆ ตามที่เป็น โดยอ้างอิงไฟล์ CSS/JS ธรรมดาและ vendor library ต่างๆ ผ่านแท็ก `<link>`/`<script>` โดยตรง

## คำสั่งที่ใช้บ่อย

โปรเจกต์นี้ไม่มีเครื่องมือ build/lint/test (ไม่มี `package.json`) หากต้องการดูเว็บไซต์บนเครื่อง ให้เสิร์ฟไดเรกทอรีผ่าน HTTP (อย่าดับเบิลคลิกเปิด `index.html` ตรงๆ) เพราะการโหลดข้อมูลด้วย `fetch()` (อธิบายด้านล่าง) จะถูกบล็อกภายใต้โปรโตคอล `file://`:

```
python -m http.server 8000
```

จากนั้นเปิด `http://localhost:8000/index.html`

## สถาปัตยกรรม

### HTML แบบ static ผสมกับส่วนที่ขับเคลื่อนด้วยข้อมูล (data-driven)

`index.html` คือหน้าเว็บหลักที่ใช้งานจริงเพียงหน้าเดียว ส่วนใหญ่ของหน้าเป็นมาร์กอัป static ที่เขียนตรงตามคลาสของคอมโพเนนต์ในเทมเพลต (`tt-section`, `tt-heading`, `pcli-*`, `ttgr-*` ฯลฯ) — ให้แก้ไข HTML โดยตรงสำหรับส่วนเหล่านี้

มีอยู่หนึ่งส่วนที่ขับเคลื่อนด้วยข้อมูล: บล็อก portfolio-compact-list ที่ชื่อ **"competition"** (`<div id="competition-list">`) ถูกเติมข้อมูลตอนรันไทม์โดย [assets/js/competitions.js](assets/js/competitions.js) ซึ่งจะ fetch ไฟล์ [assets/data/competitions.json](assets/data/competitions.json) แล้ว render มาร์กอัป `.pcli-item` ลงในคอนเทนเนอร์ หากต้องการเพิ่ม/แก้ไข/ลบรายการแข่งขัน ให้แก้ที่ไฟล์ JSON เท่านั้น แต่ละรายการมีฟิลด์ `name`, `year`, `award`, `image` — ไม่ต้องแก้ HTML/JS เพื่ออัปเดตเนื้อหา

เมื่อจะเพิ่มส่วนที่ขับเคลื่อนด้วยข้อมูลใหม่ๆ ให้ทำตามแพทเทิร์นเดียวกันนี้: เก็บเนื้อหาไว้ในไฟล์ JSON ภายใต้ `assets/data/` และเขียนสคริปต์เฉพาะเล็กๆ ไว้ใน `assets/js/` (โหลดหลัง `theme.js` ใน `index.html`) เพื่อ fetch ข้อมูลแล้ว render มาร์กอัปให้ตรงกับคลาสของคอมโพเนนต์ที่มีอยู่แล้วในเทมเพลต

### ลำดับการรันของ vendor/theme JS มีผลสำคัญ

สคริปต์ถูกโหลดไว้ท้าย `<body>` ตามลำดับนี้: jQuery → GSAP (+ ScrollTrigger, ScrollToPlugin) → Lenis → Isotope → Fancybox → Swiper → `assets/js/theme.js` → สคริปต์เฉพาะหน้าอื่นๆ (เช่น `assets/js/competitions.js`)

`assets/js/theme.js` เป็น IIFE ก้อนใหญ่ก้อนเดียวที่รันทันทีตอนสคริปต์ถูก execute (ไม่ได้รอ `DOMContentLoaded`) และสแกน DOM ด้วย `.each()`/`.on()` เพียงครั้งเดียวเพื่อผูกพฤติกรรมต่างๆ ได้แก่: อนิเมชัน scroll-reveal (`.tt-anim-fadeinup`, `.tt-text-reveal`), custom cursor (`[data-cursor]`), ปุ่มแบบ magnetic (`.tt-magnetic-item`), การเล่นวิดีโอตอน hover ใน portfolio (`.pcli-item`), Isotope grid, Swiper slider ฯลฯ เนื่องจากการผูก event เหล่านี้เกิดขึ้นครั้งเดียวตอนสคริปต์รัน องค์ประกอบที่ถูกแทรกเข้า DOM *ภายหลัง* จาก `theme.js` รันไปแล้ว (เช่นที่ `competitions.js` ทำ) จะ**ไม่ได้**พฤติกรรม cursor/magnetic-item/video-hover โดยอัตโนมัติ — มีเพียง scroll-reveal เท่านั้นที่คุ้มค่าจะ re-implement ต่อองค์ประกอบ (ดูวิธีที่ `competitions.js` เล่น GSAP timeline ของ `tt-anim-fadeinup` ซ้ำด้วยตัวเองสำหรับรายการที่มันแทรกเข้าไป เพราะ GSAP/ScrollTrigger เป็นตัวแปร global ไม่ได้ถูกครอบอยู่ใน closure ของ `theme.js`)

### การตั้งค่าเทมเพลตขับเคลื่อนด้วยคลาส CSS

พฤติกรรมหลายอย่างถูกเปิด/ปิดผ่านคลาส CSS ที่มีคำอธิบายอยู่ใน HTML comment เหนือมาร์กอัปที่เกี่ยวข้องโดยตรง (เช่นบน `<body>`: `tt-transition`, `tt-magic-cursor`, `tt-noise`, `tt-smooth-scroll`; บน `.tt-portfolio-compact-list`: `pcl-caption-hover`, `pcl-image-hover`) ให้อ่าน comment block ที่อยู่เหนือคอมโพเนนต์ก่อนแก้ไขคลาสของมัน — ปกติจะมีคำอธิบายครบทุกรูปแบบที่รองรับ

### โครงสร้าง CSS

- `assets/css/helper.css` — คลาส utility/helper (spacing, สี, grid, การซ่อน/แสดง ฯลฯ) มีสารบัญกำกับไว้ด้านบนไฟล์
- `assets/css/theme.css` — สไตล์หลักของเทมเพลต (แยกตามคอมโพเนนต์ เช่น `.pcli-*` สำหรับ portfolio compact list, `.tt-grid`/`.ttgr-*` สำหรับ gallery grid)
- `assets/css/theme-light.css` — สไตล์ override สำหรับโหมดสว่าง (light mode)
- `assets/css/blog.css` — สไตล์เฉพาะส่วนบล็อก

### อื่นๆ

- `.htaccess` ตั้งค่า Apache expires-caching และการบีบอัด gzip/deflate สำหรับโฮสต์ที่ใช้งานจริง — ต้องอัปเดตให้สอดคล้องกันหากเพิ่มชนิดไฟล์ static ใหม่
- รูปภาพถูกสร้างไว้ล่วงหน้าหลายขนาด (`assets/img/**/800/`, `1200/`, `1920/`) สำหรับใช้งานแบบ responsive คล้าย `srcset` — เมื่อเพิ่มรูปใหม่ให้กับคอมโพเนนต์ที่มีอยู่ ให้ทำตามธรรมเนียมเดียวกันนี้ (ความกว้างสูงสุดที่แนะนำคือ 800px ตามคอมเมนต์ในเทมเพลต)
