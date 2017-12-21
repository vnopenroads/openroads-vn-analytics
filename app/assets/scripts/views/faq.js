import React from 'react';
import {
  compose,
  getContext
} from 'recompose';
import T, {
  translate
} from '../components/t';


const Faq = ({ language }) => (
  <section className='inpage'>
    <header className='inpage__header'>
      <div className='inner'>
        <div className='inpage__headline'>
          <h1 className='inpage__title'><T>Frequently Asked Questions</T></h1>
        </div>
      </div>
    </header>
    <div className='inpage__body'>
      <div className='inner'>
        {/* EXAMPLE QUESTION
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>ADD ENGLISH QUESTION TITLE HERE</h3>
              <p>ADD ENGLISH QUESTION ANSWER HERE</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>ADD VIETNAMESE QUESTION TITLE HERE</h3>
              <p>ADD VIETNAMESE QUESTION ANSWER HERE</p>
            </section>
        */}
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>I typed in the correct username and password but couldn’t open ORMA</h3>
              <p>Please change your Vietnamese typing into English</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Tôi đã nhập đúng tên người dùng và mật khẩu nhưng không thể mở ORMA</h3>
              <p>Hãy chuyển kiểu gõ Tiếng Việt sang tiếng Anh</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>I tried to upload data multiple times but keep getting error</h3>
              <p>Make sure the following conditions are met</p>
              <ul>
                <li>The data hasn’t been uploaded before</li>
                <li>The format of uploading file is ZIP</li>
                <li>File size is less than 4MB</li>
                <li>VPRoMMS ID in the data is correct</li>
              </ul>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Tôi đã thử tải dữ liệu lên nhiều lần nhưng vẫn gặp lỗi</h3>
              <p>Chắc chắn rằng những điều kiện sau được thỏa mãn:</p>
              <ul>
                <li>Dữ liệu này chưa được tải lên trước đây</li>
                <li>Định dạng tập tin là ZIP</li>
                <li>Kích thước tập tin nhỏ hơn 4MB</li>
                <li>Mã VPRoMMS trong dữ liệu chính xác</li>
              </ul>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>How can I show only one selected road on the map?</h3>
              <p>You can click on ‘Explore’ button next to a VPRoMMS ID</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Làm thế nào để chỉ hiện một đường đã chọn trên bản đồ?</h3>
              <p>Bạn có thể ấn vào nút ‘Hiển thị’ cạnh một mã VPRoMMS</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>How can I know which VPRoMMS IDs are uploaded?</h3>
              <p>The uploaded VPRoMMS IDs are shown in red color.</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Làm sao tôi có thể biết những mã VPRoMMS nào đã được tải lên?</h3>
              <p>Những mã VPRoMMS đã được tải lên được hiển thị màu đỏ.</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>Why can’t I click on some VPRoMMS IDs?</h3>
              <p>You can only choose a VPRoMMS ID when it has data attached to (the red one)</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Tại sao tôi không thể chọn một số mã VPRoMMS?</h3>
              <p>Bạn chỉ có thể chọn một mã VPRoMMS khi nó có dữ liệu đính kèm (mã màu đỏ)</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>Why are there two different values of road length in one VPRoMMS ID?</h3>
              <p>There are two values of length in a VPRoMMS ID: one comes from VPRoMMS speardsheet, one is calculated from GPS trace in the field. In some cases, these can be different.</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Tại sao có hai giá trị của chiều dài đường trong một mã VPRoMMS?</h3>
              <p>Có hai giá trị của chiều dài đường trong một mã VPRoMMS: một là từ bảng dữ liệu VPRoMMS, một là được tính từ dữ liệu GPS từ hiện trường. Trong một số trường hợp, những dữ liệu này có thể khác nhau.</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>What is ‘road without VPRoMMS ID’?</h3>
              <p>Some previously uploaded roads have no VPRoMMS IDs or the VPRoMMS IDs mismatch with VPRoMMS ID list in ORMA.</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>‘đường không có mã VPRoMMS’ là gì?</h3>
              <p>Một số đường đã được tải lên từ trước không có mã VPRoMMS hoặc mã VPRoMMS không khớp với danh sách mã VPRoMMS trong ORMA</p>
            </section>
        }
        {
          language === 'en' ?
            <section className="question">
              <h3 className='inpage__title'>In ‘Tasks’, the system shows that there are 3 roads but I can only see 2 roads.</h3>
              <p>Please try to zoom in and look around the roads, you may find the third one.</p>
            </section> :
            <section className="question">
              <h3 className='inpage__title'>Trong mục ‘Nhiệm vụ’, hệ thống báo rằng có 3 đường đang được hiển thị nhưng tôi chỉ thấy 2 đường.</h3>
              <p>Hãy thử phóng to và tìm xung quanh các đường đang hiển thị, bạn có thể tìm thấy đường thứ ba.</p>
            </section>
        }

        <section>
          <p>
            <T>If you have any remaining questions</T>
            <a href={`mailto:dphan2@worldbank.org?cc=gost@worldbank.org&subject=${translate(language, 'Question regarding ORMA, not answered in the FAQ')}`}>
              <button className="button button--base-raised-light"><T>email us</T></button>
            </a>
          </p>
        </section>
      </div>
    </div>
  </section>
);

export default compose(
  getContext({ language: React.PropTypes.string })
)(Faq);
