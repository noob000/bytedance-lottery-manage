import { useState, useEffect } from "react"
import axios from "axios";
import { Select, Button, message, InputNumber, Modal } from "antd";
import { giftIcon } from "../components/data";
import '../style/css/collection.css';
import { Link } from "react-router-dom";
import classNames from "classnames";
export default function Collection(props: any) {
    const [planNameList, setPlanNameList] = useState<string[]>([]);
    const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    const [usingPlan, setUsingPlan] = useState<any>(null);
    const [initalAmount, setInitalAmout] = useState<any>(0);
    const [perAmount, setPerAmount] = useState<any>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    useEffect(() => {
        axios({
            method: "get",
            url: 'https://qco156.fn.thelarkcloud.com/returnAllPlanName'
        }).then((res) => {
            setPlanNameList(res.data);
            setCurrentPlanName(res.data[0])
        })

        axios({
            method: 'get',
            url: "https://qco156.fn.thelarkcloud.com/returnUsingPlan"
        }).then((res) => setUsingPlan(res.data.planName))

        axios({
            method: "get",
            url: "https://qco156.fn.thelarkcloud.com/returnAmount"
        }).then((res) => {
            setInitalAmout(res.data.initalAmount);
            setPerAmount(res.data.perAmount)
        })
    }, []);

    useEffect(() => {
        if (currentPlanName !== null)
            axios({
                method: 'post',
                url: "https://qco156.fn.thelarkcloud.com/returnPlanData",
                data: {
                    planName: currentPlanName
                }
            }).then((res) => {
                setCurrentPlan(res.data)
            })
    }, [currentPlanName]);
    const { Option } = Select;

    const setPlan = () => {
        axios({
            method: 'post',
            url: 'https://qco156.fn.thelarkcloud.com/setPlan',
            data: {
                newPlanName: currentPlanName
            }
        })
            .then((res) => {
                console.log(res.data)
                if (res.data === 'success') message.success('修改应用抽奖计划成功！')
                else message.error('修改应用计划失败')
            })
            .then(() =>
                axios({
                    method: 'get',
                    url: "https://qco156.fn.thelarkcloud.com/returnUsingPlanName"
                })
            )
            .then((res) => setUsingPlan(res.data))
    }

    const saveAmountChange = () => {
        let result1 = String(initalAmount).indexOf('.');
        let result2 = String(perAmount).indexOf('.');
        if (result1 == -1 && result2 == -1) {
            axios({
                method: "post",
                url: "https://qco156.fn.thelarkcloud.com/setInitalAmount",
                data: {
                    initalAmount: initalAmount,
                    perAmount: perAmount
                }
            }).then((res) => {
                if (res.data == 'success') message.success('成功修改')
            })
        }
        else {
            message.warn('请设置数量为整数')
        }
    }

    const handleDelete = () => {
        axios({
            method: "post",
            url: "https://qco156.fn.thelarkcloud.com/delPlan",
            data: {
                planName: currentPlanName
            }
        }).then((res) => {
            if (res.data == 'success') {
                message.success('成功删除');
                setModalVisible(false)
            }
            else {
                message.error('删除失败');
                setModalVisible(false)
            }
        }).then(() => {
            axios({
                method: "get",
                url: 'https://qco156.fn.thelarkcloud.com/returnAllPlanName'
            }).then((res) => {
                setPlanNameList(res.data);
                setCurrentPlanName(res.data[0])
            })
            axios({
                method: 'get',
                url: "https://qco156.fn.thelarkcloud.com/returnUsingPlan"
            }).then((res) => setUsingPlan(res.data.planName))
        })
    }
    return (
        <div className='collectionPage'>

            <div className='topPart'>
                <div className='inputItem'>
                    <span>用户初始矿石数量：</span>
                    <InputNumber value={initalAmount}
                        onChange={(value: any) => setInitalAmout(value)} min={1} />
                </div>

                <div className='inputItem'>
                    <span>用户每次抽奖所消耗矿石数量：</span>
                    <InputNumber value={perAmount}
                        onChange={(value: any) => setPerAmount(value)} min={1} />
                </div>
                <Button type='primary' onClick={saveAmountChange}>保存本次修改</Button>
            </div>


            <div className=''> {currentPlanName === null ? null :
                <Select defaultValue={currentPlanName} onChange={(value) => setCurrentPlanName(value)}>
                    {planNameList.map((element) => <Option value={element}>{element}</Option>)}
                </Select>}
                {currentPlanName === usingPlan
                    ? <span>当前浏览的计划为正在使用的抽奖计划</span>
                    : <Button onClick={setPlan}>将当前计划设置为要应用的抽奖计划</Button>}
            </div>
            <div className='giftlist'>
                <ul>
                    {currentPlan === null ? <p>当前尚无抽奖计划</p> :
                        currentPlan.map(({ giftname, chance, url }: any) => <li className='listItem'>
                            <div>
                                <p>{`奖品名称: ${giftname}`}</p>
                                <p>{`中奖概率: ${chance}%`}</p>
                                {url === null ? giftIcon : <img src={url} className='previewPic' />}
                            </div>
                        </li>
                        )}
                </ul>
                {currentPlanName == '预置抽奖计划'
                    ? <Button type='primary' disabled>预置抽奖计划暂不支持修改和删除</Button>
                    : <Button type='primary' onClick={() => props.func({
                        data: currentPlan,
                        planName: currentPlanName,
                        currentState: 'modify'
                    })}><Link to='/'>修改本计划</Link></Button>}
                <Button type='primary' danger
                    className={classNames({
                        deleteButton: true,
                        buttShow: !(currentPlanName != '预置抽奖计划')
                    })}
                    onClick={() => setModalVisible(true)}>删除本计划</Button>
                <Modal title='请再次确认'
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleDelete}
                >
                    <p>点击确认删除计划：{currentPlanName}</p>
                    <p>如果删除的计划为当前使用计划，当前使用计划将会自动修改为预置抽奖计划</p>
                </Modal>
            </div>

        </div>
    )
}