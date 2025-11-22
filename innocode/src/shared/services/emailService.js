import emailjs from '@emailjs/browser';

export const initEmailJs = () => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if(publicKey) {
        emailjs.init(publicKey);
    }
};
export const sendTeamInviteEmail = async ({
    toEmail,
    teamName,
    mentorName,
    contestName,
    acceptUrl,
    declineUrl,
}) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEAM_INVITE_TEMPLATE_ID;
    if(!serviceId || !templateId){
        throw new Error('EmailJs configuration is missing');

    }
    const templateParams ={
        to_email: toEmail,
        team_name: teamName,
        mentor_name: mentorName,
        contest_name: contestName,
        accept_url: acceptUrl,
        decline_url: declineUrl,
    };
    try {
        const response = await emailjs.send(serviceId, templateId, templateParams);
        console.log('✅ Team invite email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('❌ Error sending team invite email:', error);
        return false;
    }

}
