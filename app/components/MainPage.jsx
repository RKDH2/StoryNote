import stylys from "../components/styles/MainPage.module.css";
import Community from "../(community)/community/page";
import { AiFillWechat } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

export default function MainPage() {
  return (
    <div className={stylys.main_container}>
      <div className={stylys.main_text_container}>
        <div className={stylys.title_text}>이야기 노트 ✏️</div>
        <div className={stylys.sub_text}>새로운 이야기를 만나보세요!</div>
        <div className={stylys.text}>
          사람들과 소통하고, 지식을 넓히고, 자신의 이야기를 기록하세요.
        </div>
      </div>
      <div className={stylys.info_text}>
        <div>
          <div>
            <AiFillWechat className={stylys.icon} size={35} />
          </div>
          <p>의사소통</p>
        </div>
        <div>
          <div>
            <IoShareSocialOutline className={stylys.icon} size={35} />
          </div>
          <p>이야기 공유</p>
        </div>
        <div>
          <div>
            <IoSettingsOutline className={stylys.icon} size={35} />
          </div>
          <p>간편한 로그인</p>
        </div>
      </div>
      <div className={stylys.post_text}>작성된 글!</div>
      <div>
        <Community />
      </div>
    </div>
  );
}
