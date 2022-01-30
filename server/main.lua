Menu.RegisterEvent('menu:isAdmin', function(source)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

	return (xPlayer.getGroup() == Config.RequiredGroup)
end)

Menu.RegisterEvent('menu:getItems', function(source)
    MySQL.Async.fetchAll("SELECT * FROM `items`", {}, function(items)
        TriggerClientEvent('menu:sendItems', source, items)
    end)
end)

Menu.RegisterEvent('menu:giveItem', function(source, item, amount)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    if xPlayer.canCarryItem(item, amount) then
        xPlayer.addInventoryItem(item, amount)
        print('^5[Menu]^7 Successfully added x' .. amount .. ' item/s with name: `' .. item .. '` to ' .. xPlayer.getName() .. '!')
    end
end)

-- Credit to: chezza#1234
function CheckItem(name)
    local p = promise.new()
    MySQL.Async.fetchScalar("SELECT COUNT(1) FROM items WHERE name=@name", 
    {
        ["@name"] = name
    }, function (count)
        if count > 0 then 
            p:resolve(false)
        else 
            p:resolve(true)
        end
    end)
    return Citizen.Await(p)
end

Menu.RegisterEvent('menu:createItem', function(source, name, label, weight, limit, isLimit, isWeight)
    if CheckItem(name) then
        if isLimit and not isWeight then
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `limit`) VALUES (@name, @label, @limit)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@limit'] = tonumber(limit)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        elseif not isLimit and isWeight then
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `weight`) VALUES (@name, @label, @weight)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@weight'] = tonumber(weight)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        else
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `weight`, `limit`) VALUES (@name, @label, @weight, @limit)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@weight'] = tonumber(weight),
                ['@limit'] = tonumber(limit)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        end
    else
        print('^5[Menu]^7 Item with name: `' .. name .. '` already exist!')
    end
end)

Menu.RegisterEvent('menu:clearInventory', function(source)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    for i=1, #xPlayer.inventory, 1 do
		if xPlayer.inventory[i].count > 0 then
			xPlayer.setInventoryItem(xPlayer.inventory[i].name, 0)
		end
	end
end)