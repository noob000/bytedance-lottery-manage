import InspireCloud from "@byteinspire/js-sdk";
const serviceId = 'qco156';
const fileUploadToken = 'd7a1971c-f84b-4fb6-aaf0-6cfc887e577e';
const inspirecloud = new InspireCloud({ serviceId });
export default async function Upload(filearr: any[]) {
    let temparr: any = [];

    for (let element of filearr) {
        if (element != null) {
            const filename = element.name;
            await inspirecloud.file.upload(filename, element, { token: fileUploadToken })
                .then((res) => {
                    temparr.push(res.url)
                })

        }
        else temparr.push('defaultGift')

    }

    return temparr;
}
