const Pedido = require('../models/pedidoModel');
const User = require('../models/userModel');
const Producto = require('../models/productModel');
const jwt = require('../middlewares/jwt');

async function createPedido(infoPedido, user, address, session) {
   
    const items = [];
    let total = 0;

    infoPedido.map(item => {
        const element = {
            product: item.product._id,
            cant: item.cant,
            subtotal: item.subtotal
        };
        items.push(element);
        total = total + item.subtotal;
    });
    
    
    const newPedido = new Pedido({
        customer: user,
        address: address,
        info_products: items,
        total: total,
        status: 'pending',
        session_id: session,
        pay: false,
        created_at: today(new Date()) 
    });

    await newPedido.save();
}

async function paySuccess(session) {
    const pedido = await Pedido.findOne({session_id: session});
    if(pedido) {
        pedido.pay = true;
        await pedido.updateOne(pedido);
    }
}

async function getPedidos(req, res) {
    Pedido.find({pay: true})
        .populate({path: 'customer'})
        .populate({path: 'info_products.product'})
        .where('status').in(['pending', 'delivery'])
        .exec((err, response) => {
            res.send(response);
        })
}

async function updateStatus(req, res) {
    const pedidoId = req.body.pedido;
    const newStatus = req.body.status;

    const pedido = await Pedido.findById(pedidoId);
    pedido.status = newStatus;
    await pedido.updateOne(pedido);

    res.send({ok: 'OK'})
}


async function getPedidosByUser(req, res) {
    const payload = jwt.decodeToken(req.token);
    const userId = payload.payload.sub;

    Pedido.find({customer: userId, pay: true})
        .populate({path: 'info_products.product'})
        .populate({path: 'customer'})
        .sort({created_at: -1})
        .exec((err, response) => {
            if(!err) return res.status(200).send(response);

            return res.status(404).send({message: 'error'});
        })
        console.log(userId)
    // res.send({ok: 'ok'})
}

async function countPedidos(req, res) {
    const pedidos = await Pedido.find()
        .where('status').in(['pending', 'delivery'])
        .countDocuments();

    console.log(pedidos)

    res.status(200).send({pedidos})
}

async function countVentas(req, res) {
    const ventas = await Pedido.find({pay: true}).countDocuments();
    res.status(200).send({ventas})
}

async function totalVentas(req, res) {
    const dia = today(new Date()).split('T')[0];
    Pedido.find({created_at: {
        $gte: today(new Date(dia+':00:00:00')),
        $lt: today(new Date())
    }})
    .select('total')
    .exec((err, result) => {
        if(result) {
            let total = 0;
            result.map(p => total += p.total);
            return res.status(200).send({total})
        }
        return res.status(404).send({message: 'Error'})
    })


}


async function mejoresClientes(req, res) {
    const pedidos = await Pedido.aggregate([
        {$match: {pay: true}},
        {$group: {_id: "$customer", value: {$sum: "$total"}}},
        {$sort: {value: -1}},
        {$limit: 10},
    ]).exec();

    const result = await User.populate(pedidos, {path: '_id', select: 'name value -_id'})

    const dataChart = [];

    result.map(data => {
        const element = {
            data: [data.value],
            label: data._id.name
        };
        dataChart.push(element);
    })

    res.send(dataChart)
}


async function panesMasVendidos(req, res) {
    const panes = await Pedido.aggregate([
        {$unwind: {path: "$info_products"}},
        {$group: {_id: "$info_products.product", value: {$sum: "$info_products.cant"}}},
        {$sort: {value: -1}}
        // {$limit: 5}
    ]);
    console.log(panes)
    const result = await Producto.populate(panes, {path: '_id', select: 'name -_id'});
    
    const dataChart = {
        data: [],
        labels: []
    };

    let count = 1;
    result.map(data => {
        if(count <= 5) {
            dataChart.data.push(data.value);
            dataChart.labels.push(data._id.name);
            count++;
        }
       
    });

    res.send(dataChart)
} 


function today(d) {
    var z  = n =>  ('0' + n).slice(-2);
    var zz = n => ('00' + n).slice(-3);
    var off = d.getTimezoneOffset();
    var sign = off < 0? '+' : '-';
    off = Math.abs(off);
  
    return d.getFullYear() + '-'
           + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + 'T' +
           z(d.getHours()) + ':'  + 
           z(d.getMinutes()) + ':' +
           z(d.getSeconds()) + '.' +
           zz(d.getMilliseconds()) + 'Z'

}
function lastDay(d) {
    var z  = n =>  ('0' + n).slice(-2);
    var zz = n => ('00' + n).slice(-3);
    var off = d.getTimezoneOffset();
    var sign = off < 0? '+' : '-';
    off = Math.abs(off);
  
    return d.getFullYear() + '-'
           + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + 'T' +
           z(d.getHours()) + ':'  + 
           z(d.getMinutes()) + ':' +
           z(d.getSeconds()) + '.' +
           zz(d.getMilliseconds()) + 'Z'
}

module.exports = {
    createPedido,
    paySuccess,
    getPedidos,
    updateStatus,
    getPedidosByUser,
    countPedidos,
    countVentas,
    totalVentas,
    mejoresClientes,
    panesMasVendidos
}