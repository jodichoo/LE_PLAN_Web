function Contact() {
  return (
    <div className="contact">
      <p className="info">
        Singapore, Singapore, Singapore <br />
        +65 6565 6565 <br />
        baochickawaowao@gmail.com (this is a legit email)
        <br />
      </p>

      <p className="creators">
        <h3>CREATORS:</h3>
        <div>Tan Shee Hui</div>
        <div>Jodi Choo</div>
      </p>
      <p>
        <h3>OUR GITHUB REPO:</h3>
        <div>
          Access LE PLAN Mobile App Repository{' '}
          <a className="repo" href={"https://github.com/sheehui/LE_PLAN_APP"}>here</a>
        </div>
        <div>
          Access LE PLAN Web App Repository{' '}
          <a className="repo" href={"https://github.com/sheehui/WLBBOT"}>here</a>
        </div>
      </p>
    </div>
  );
}

export default Contact;
