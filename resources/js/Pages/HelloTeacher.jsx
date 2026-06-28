export default function HelloTeacher() {
    return (
        <div>
            <h1>Greeting to all teachers of computer science</h1>
            <Greeting name="ชวลิต" lastname="โควีระวงศ์" />
            <Greeting name="ณัฐรดี" lastname="อนุพงค์" />
            <Greeting name="วิศรุต" lastname="ขวัญคุ้ม" />
            <Greeting name="ดาวรถา" lastname="วีระพันธ์" />
            <Greeting name="ประณมกร" lastname="อัมพรพรรดิ์" />
            <Greeting name="ณัฏฐิรา" lastname="ศุขไพบูลย์" />
        </div>
    );
}

// ลบ : any ออกเพื่อให้เป็น JavaScript ธรรมดา
function Greeting({ name, lastname }) {
    return <h1>Hello, { name } { lastname } !</h1>;
}