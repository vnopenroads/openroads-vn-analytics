import React from 'react';
import { connect } from 'react-redux';
import { t } from '../utils/i18n';

const Faq = ({ language }) => (
  <section className='inpage'>
    <header className='inpage__header'>
      <div className='inner'>
        <div className='inpage__headline'>
          <h1 className='inpage__title'>{t('Frequently Asked Questions')}</h1>
        </div>
      </div>
    </header>
    <div className='inpage__body'>
      <div className='inner'>
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

        <section>
          <form action="mailto:dphan2@worldbank.org" method="GET">
            <p>
              If you have any remaining questions
              <button className="button button--base-raised-light">email us</button>
            </p>
          </form>
        </section>
      </div>
    </div>
  </section>
);

export default connect(
  state => ({
    language: state.language.current
  })
)(Faq);
