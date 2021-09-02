import { useState, useEffect, useRef, Ref } from "react"
import { InputNumber, message, Form, Input, Button } from "antd";
import 'antd/dist/antd.css';
import { giftIcon } from "../components/data";
import '../style/css/home.css';
import classNames from 'classnames';
import axios from "axios";
import Upload from '../components/upload';

interface fieldData {
    giftname: string | undefined,
    chance: string | undefined
}

interface giftList extends fieldData {
    url: string
}
export default function Home(props: any) {
    const inputEl: any = useRef(null);
    const formEL: any = useRef(null)
    const [fieldData, setFieldData] = useState<fieldData>({ giftname: '', chance: '' })
    const [giftList, setGiftList] = useState<giftList[]>([]);
    const [fileUrl, setFileUrl] = useState<any>(null);
    const [planName, setPlanName] = useState<string>('抽奖计划1');
    const [usedName, setUsedName] = useState<string[]>([]);
    const [fileList, setFileList] = useState<any>([]);
    const [tempFile, setTempFile] = useState<any>(null);
    const [currentState, setCurrentState] = useState<any>('add');
    const [oldPlanName, setOldPlanName] = useState<any>(null)

    const handleFileChange = (event: any) => {

        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            setTempFile(file);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setFileUrl(reader.result)
        }
    }

    const resetFileSelector = () => {
        if (fileUrl) {
            const current: any = inputEl.current;
            current.value = '';
            setFileUrl(null);
        }
    }

    const addGift = () => {
        if (fieldData.giftname !== '' && fieldData.chance !== '') {
            const gift: giftList = {
                giftname: fieldData.giftname,
                chance: fieldData.chance,
                url: fileUrl
            }
            formEL.current.setFieldsValue({ giftname: '', chance: '' })
            setFileList((prev: any) => [...prev, tempFile]);
            setTempFile(null);
            setGiftList((prev) => [...prev, gift]);
            setFieldData({ giftname: '', chance: '' });
            resetFileSelector();
        }
        else message.error('请填写奖品名称及中奖概率')
    }

    const savePlan = () => {
        if (giftList.length < 4 || giftList.length > 8) {
            message.warn('请正确设置奖品数量');
            return;
        }
        if (planName === '' || planName == null) {
            message.warning('请填写抽奖计划名称');
            return;
        }
        if (usedName.indexOf(planName) != -1) {
            message.warning('该抽奖计划名称已被使用');
            return;
        }
        let sum = 0;
        for (let { chance } of giftList) {
            sum += Number(chance);
        }
        if (sum != 100) message.error('请正确设置奖品中奖概率使得所有奖品中奖概率总和为100%');
        else {
            const fileArr: any = Upload(fileList).then((res) => {
                const fileArr = res;
                let result = [];

                for (let i = 0, l = giftList.length; i < l; i++) {
                    let obj = {
                        giftname: giftList[i].giftname,
                        chance: giftList[i].chance,
                        url: fileArr[i]
                    }
                    result.push(obj)
                }


                return result;
            })
                .then((res) => {
                    axios({
                        method: 'post',
                        url: 'https://qco156.fn.thelarkcloud.com/insertPlan',
                        data: {
                            planName: planName,
                            data: res
                        }
                    }).then((res) => {
                        if (res.data === 'success') {
                            message.success('成功保存抽奖计划');
                            setGiftList([]);
                        }
                        else {
                            message.error('保存抽奖计划失败')
                        }
                    })
                })


        }
    }
    const delGift = (name: any) => {
        setGiftList((prev) => prev.filter((currentValue) => currentValue.giftname !== name));
    }

    const saveModify = () => {
        if (giftList.length < 4 || giftList.length > 8) {
            message.warn('请正确设置奖品数量');
            return;
        }
        if (planName === '' || planName == null) {
            message.warning('请填写抽奖计划名称');
            return;
        }
        if (usedName.indexOf(planName) != -1) {
            message.warning('该抽奖计划名称已被使用');
            return;
        }
        let sum = 0;
        for (let { chance } of giftList) {
            sum += Number(chance);
        }
        if (sum != 100) message.error('请正确设置奖品中奖概率使得所有奖品中奖概率总和为100%');
        else {
            const fileArr: any = Upload(fileList).then((res) => {
                const fileArr = res;
                let result = [];
                for (let i = 0, j = 0, l = giftList.length; i < l; i++) {
                    let obj = {
                        giftname: giftList[i].giftname,
                        chance: giftList[i].chance,
                        url: giftList[i] === null ? 'defaultGift' : fileArr[j++]
                    }
                    result.push(obj)
                }
                return result;
            })
                .then((res) => {
                    axios({
                        method: 'post',
                        url: 'https://qco156.fn.thelarkcloud.com/modifyPlan',
                        data: {
                            oldPlanName: oldPlanName,
                            planName: planName,
                            data: res
                        }
                    }).then((res) => {
                        if (res.data === 'success') {
                            message.success('成功保存抽奖计划');
                            setGiftList([]);
                        }
                        else {
                            message.error('保存抽奖计划失败')
                        }
                    })
                })
        }
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: 'https://qco156.fn.thelarkcloud.com/returnAllPlanName'
        }).then((res) => {
            setUsedName(res.data);
        });
    }, [])

    useEffect(() => {
        const { modifyPlan } = props;
        if (modifyPlan !== null) {
            const { data, planName, currentState } = modifyPlan;
            setGiftList(data);
            setOldPlanName(planName)
            setPlanName(planName);
            setCurrentState(currentState);
        }

    }, [props])
    return (
        <div className='homePage'>

            <div className='formContainer'>
                <Form labelCol={{ span: 8 }}
                    wrapperCol={{ span: 8 }}
                    fields={[{ name: ['giftname', 'chance'] }]}
                    onValuesChange={(changeValues, allValues) => setFieldData(allValues)}
                    ref={formEL}
                >
                    <Form.Item label='奖品名称' name='giftname' required>
                        <Input />
                    </Form.Item>
                    <Form.Item label='中奖概率' name='chance' required>
                        <InputNumber min={0}
                            max={100}
                            formatter={value => `${value}%`}

                        />
                    </Form.Item>
                </Form>
                <div className='fileSelect'>
                    <span>选择奖品图片：</span>
                    <input type='file' onChange={handleFileChange} ref={inputEl} />
                </div>

                <p className={classNames({ resetDisplay: !(fileUrl === null) })}
                    style={{ color: 'red' }}>如不选择图片奖品将采用默认图片样式</p>

                <div className='previewContainer'>
                    <div>
                        <span>图片预览：</span>
                        <img src={fileUrl} className='previewPic' />
                        <p className={classNames({ resetDisplay: (fileUrl === null) })}>预览效果即为实际抽奖页面图片效果</p>
                    </div>
                    <Button onClick={resetFileSelector}
                        className={classNames({ resetDisplay: (fileUrl === null) })}
                        type='dashed' >重新选择图片</Button>
                </div>
                <Button onClick={addGift} type='primary'>添加到奖品列表</Button>

            </div>


            <div className='giftList'>
                <div className='planNameInput'>
                    <span>抽奖计划名称：</span>
                    <Input placeholder={'请填写抽奖计划的名称'}
                        defaultValue={'抽奖计划1'}
                        onChange={(event) => setPlanName(event.target.value)} />
                </div>
                <h1>奖品列表(支持4-8个奖品)</h1>
                <ul>
                    {giftList.map(({ giftname, chance, url }) => <li className='listItem'>
                        <div>
                            <p>{`奖品名称: ${giftname}`}</p>
                            <p>{`中奖概率: ${chance}%`}</p>
                            {url === null ? giftIcon : <img src={url} className='previewPic' />}
                        </div>
                        <Button danger onClick={() => delGift(giftname)} className='delButton'>删除该奖品</Button>
                    </li>)}
                </ul>
                {currentState === 'add'
                    ? <Button onClick={savePlan} type='primary'>保存该抽奖计划</Button>
                    : <Button onClick={saveModify} type="primary">保存本次修改的抽奖计划</Button>}
            </div>
        </div>
    )
}