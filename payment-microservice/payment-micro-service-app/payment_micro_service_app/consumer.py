from main import redis, Order
import time

key = "refund_order"
group = "payment-group"

try:
    redis.xgroup_create(key, group, mkstream=True)
except:
    print("Group already exists")

while True:
    try:
        results = redis.xreadgroup(group, key, {key: ">"}, None)
        if results != []:
            for result in results:
                obj = result[1][0][1]
                print(obj)
                order = Order.get(obj["pk"])
                order.status = 'Refunded'
                order.save()
    except Exception as e:
        print(e)
    time.sleep(1)
