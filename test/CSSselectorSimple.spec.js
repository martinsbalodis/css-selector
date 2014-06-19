describe("CSS Selector Simple", function () {
	var selector, $el;
    jQuery("body").append("<div id='simple-tests'></div>");

	beforeEach(function () {

        $el = jQuery("#simple-tests").html("");
		selector = new CssSelector({
			parent: jQuery('#simple-tests')[0],
			enableResultStripping: true,
			ignoredClasses: [
				'test-ignore-tags',
				'test-multi-element-n',
				'test-skip-top-n'
			]
		});
	});

	it("should be able to select one element", function () {

        $el.append('<div><a name="test-simple-element"></a><b></b></div><a></a>');

		var element = document.getElementsByName('test-simple-element')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("div:nth-of-type(1) > a:nth-of-type(1)");
	});

	it("should be able to select multiple elements", function () {

        $el.append('<div><span><a name="test-milti-element"></a></span><span><a name="test-milti-element"></a></span></div>');

		var elements = document.getElementsByName('test-milti-element');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("div:nth-of-type(2) > span > a:nth-of-type(1)");
	});

	it("should be able to select multiple elements n+", function () {

        $el.append('<div><span><a></a></span><span><a class="test-multi-element-n"></a></span><span><a class="test-multi-element-n"></a></span></div>');

		var elements = jQuery('.test-multi-element-n');
		var css_selector = selector.getCssSelector(elements);


		expect(css_selector).toBe("div:nth-of-type(3) > span:nth-of-type(n+2) > a:nth-of-type(1)");
	});

	it("should be able to ignore tags", function () {

		var elements = jQuery('.test-ignore-tags');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("table:nth-of-type(1) > tbody:nth-of-type(1) > tr:nth-of-type(1) > td:nth-of-type(1)");
	});

	it("should be able to skip elements from top", function () {

		var elements = jQuery('.test-skip-top');
		var css_selector = selector.getCssSelector(elements, 2);

		expect(css_selector).toBe("table:nth-of-type(2) > tbody:nth-of-type(1) > tr:nth-of-type(1)");
	});

	it("should be able to skip elements from top and use n+1 selectors", function () {

		var elements = jQuery('.test-skip-top-n');
		var css_selector = selector.getCssSelector(elements, 2);

		expect(css_selector).toBe("table:nth-of-type(3) > tbody:nth-of-type(1) > tr:nth-of-type(n+2)");
	});
});

//describe("CSS Selector Strip", function () {
//	var selector;
//
//	beforeEach(function () {
//		selector = new CssSelector({
//			parent: jQuery('#strip-tests')[0],
//			ignoredClasses:['do-not-strip-direct-child-test']
//		});
//	});
//
//	it("should be able to strip indexes", function () {
//
//		var element = document.getElementsByName('strip-index-test')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("input");
//	});
//
//	it("should be able to strip ids", function () {
//
//		var element = document.getElementsByName('strip-id-test')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("textarea");
//	});
//
//	it("should be able to strip classes", function () {
//
//		var element = document.getElementsByName('strip-tags-test')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("select");
//	});
//
//	it("should be able to strip whole tags", function () {
//
//		var element = document.getElementsByName('strip-classes-test')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("span.needed a");
//	});
//
//	it("should not strip direct child when a subchild exists", function () {
//
//		var elements = $('.do-not-strip-direct-child-test');
//		var css_selector = selector.getCssSelector(elements);
//
//		expect(css_selector).toBe("span > div");
//	});
//
//});
//
//describe("Smart table selectors", function () {
//	var selector;
//
//	beforeEach(function () {
//		selector = new CssSelector({
//			parent: jQuery('#table-tests')[0],
//			enableSmartTableSelector: true,
//			query: jQuery
//		});
//	});
//
//	it("should be select cells based on text in desciption cell", function () {
//
//		var element = document.getElementsByClassName('table-cell-test1')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("tr:contains('Item:') td.table-cell-test1");
//	});
//
//	it("should be select cells based on text in desciption cell(th)", function () {
//
//		var element = document.getElementsByClassName('table-cell-test3')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("tr:contains('Item2:') td.table-cell-test3");
//	});
//
//	it("should drop its smartness when selecting multiple items", function () {
//
//		var elements = jQuery('.table-cell-test2');
//		var css_selector = selector.getCssSelector(elements);
//		expect(css_selector).toBe("td.table-cell-test2");
//
//	});
//
//});
//
//describe("Ignored classes", function () {
//	var selector;
//
//	beforeEach(function () {
//		selector = new CssSelector({
//			parent: jQuery('#ignored-classes-tests')[0],
//			ignoredClasses: ['ignored']
//		});
//	});
//
//	it("should ignore classes", function () {
//
//		var element = document.getElementsByClassName('ignored-class-test1')[0];
//		var css_selector = selector.getCssSelector([element]);
//
//		expect(css_selector).toBe("a.ignored-class-test1");
//	});
//
//});
//
//describe("Bugs", function () {
//	var selector;
//
//	beforeEach(function () {
//		selector = new CssSelector({
//			parent: jQuery('#jquery-children-test-parent')[0],
//			query: jQuery
//		});
//	});
//
//	it("should select children of parent while using jquery", function () {
//
//		var elements = jQuery('#jquery-children-test-parent a');
//		var css_selector = selector.getCssSelector(elements);
//
//		expect(css_selector).toBe("a");
//	});
//
//});