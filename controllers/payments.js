const currentDate = () => new Date().toISOString();
const paymentCamelCase = (payment) => ({
  id: payment.id.toString(),
  payeeId: payment.payee_id,
  payerId: payment.payer_id,
  paymentSystem: payment.payment_system,
  paymentMethod: payment.payment_method,
  amount: payment.amount,
  currency: payment.currency,
  comment: payment.comment,
  created: payment.created,
  updated: payment.updated,
});
const paymentsCamelCase = (payments) => payments.map(paymentCamelCase);

const getPayments = async (req, res, db) => {
  try {
    const result = await db.select('*').from('payments');
    res.json(paymentsCamelCase(result));
  } catch (e) {
    res.status(400).json(e);
  }
};

const getPayment = async (req, res, db) => {
  try {
    const { id } = req.params;
    const result = await db.select('*')
      .from('payments')
      .where('id', '=', parseInt(id, 10));
    res.json(paymentCamelCase(result[0]));
  } catch (e) {
    res.status(400).json(e);
  }
};

const createPayment = async (req, res, db) => {
  const {
    payeeId,
    payerId,
    paymentSystem,
    paymentMethod,
    amount,
    currency,
    comment,
  } = req.body;

  try {
    const result = await db
      .returning('id')
      .insert({
        payee_id: payeeId,
        payer_id: payerId,
        payment_system: paymentSystem,
        payment_method: paymentMethod,
        status: 'created',
        amount: parseFloat(parseFloat(amount || 0).toFixed(2)),
        currency,
        comment,
        created: currentDate(),
        updated: currentDate(),
      }).into('payments');
    res.json(result[0] || undefined);
  } catch (e) {
    res.status(400).json(e);
  }
};

const approvePayment = async (req, res, db) => {
  const { id } = req.params;
  
  try {
    const payment = await db.select('*')
      .from('payments')
      .where('id', '=', parseInt(id, 10));
    if (!payment || !payment.length) {
      res.status(400).json({
        code: 'ERR_CANNOT_APPROVE',
        message: 'Payment does not exist',
      });
    } else if (payment[0].status === 'canceled') {
      res.status(400).json({
        code: 'ERR_CANNOT_APPROVE',
        message: 'Cannot approve payment already been canceled',
      });
    }
    
    await db
      .where('id', id)
      .whereNot('status', 'canceled')
      .update({ status: 'approved' })
      .into('payments');
  } catch (e) {
    res.status(400).json(e);
  }
  
  res.send();
}

const cancelPayment = async (req, res, db) => {
  const { id } = req.params;
  try {
    const payment = await db.select('*')
      .from('payments')
      .where('id', '=', parseInt(id, 10));
    if (!payment || !payment.length) {
      res.status(400).json({
        code: 'ERR_CANNOT_CANCEL',
        message: 'Payment does not exist',
      });
    } else if (payment[0].status === 'approved') {
      res.status(400).json({
        code: 'ERR_CANNOT_CANCEL',
        message: 'Cannot cancel payment already been approved',
      });
    }
    await db
      .where('id', id)
      .whereNot('status', 'approved')
      .update({ status: 'canceled' })
      .into('payments');
  } catch (e) {
    res.status(400).json(e);
  }
  
  
  res.send();
}

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  approvePayment,
  cancelPayment,
};
